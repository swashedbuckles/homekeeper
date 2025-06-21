import crypto from 'node:crypto';

import {
  HOUSEHOLD_ROLES,
  INVITATION_STATUSES,
  INVITATION_STATUS,
  type IInvitation as InvitationInterface,
} from '@homekeeper/shared';

import {
  type HydratedDocument,
  type Model,
  Schema,
  model
} from 'mongoose';
import { INVITATION_EXPIRE_TIME_MS } from '../constants';

export interface IInvitationMethods {
  cancel(): Promise<InvitationDocument>;
  redeem(): Promise<InvitationDocument>;
  expire(): Promise<InvitationDocument>;
  isValid(): boolean;
  isRedeemed(): boolean;
}

export interface IInvitation extends Omit<InvitationInterface, 'householdId' | 'invitedBy'> {
  householdId: Schema.Types.ObjectId;
  invitedBy: Schema.Types.ObjectId;
}

type UserDetails = { email: string, role: string, name?: string };
export interface IInvitationModel extends Model<IInvitation, object, IInvitationMethods> {
  createInvitation(userDetails: UserDetails, householdId: string | Schema.Types.ObjectId, userId: string | Schema.Types.ObjectId): Promise<InvitationDocument>;
}

export type InvitationDocument = HydratedDocument<IInvitation, IInvitationMethods>;

const invitationSchema = new Schema<IInvitation, IInvitationModel, IInvitationMethods>({
  code: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  role: {
    type: String,
    enum: HOUSEHOLD_ROLES,
    default: 'guest',
    required: true
  },
  householdId: {
    type: Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: INVITATION_STATUSES,
    default: 'pending',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },

  statics: {
    async createInvitation(userDetails: UserDetails, householdId: string | Schema.Types.ObjectId, invitedBy: string | Schema.Types.ObjectId) {
      const document = new this({
        name: userDetails.name ?? '',
        email: userDetails.email,
        role: 'guest', /** @todo reconcile when we support specifying role */
        code: generateInvitationCode(),
        householdId,
        invitedBy,
        status: 'pending',
        expiresAt: Date.now() + INVITATION_EXPIRE_TIME_MS
      });

      const invitation = await document.save();

      return invitation as InvitationDocument;
    }
  },

  methods: {
    async cancel(this: InvitationDocument): Promise<InvitationDocument> {
      if (this.status === INVITATION_STATUS.PENDING) {
        this.$locals.allowStatusChange = true;
        this.status = INVITATION_STATUS.CANCELLED;
        return await this.save();
      }

      return Promise.resolve(this);
    },

    async redeem(this: InvitationDocument): Promise<InvitationDocument> {
      if (this.status === INVITATION_STATUS.PENDING) {
        this.$locals.allowStatusChange = true;
        this.status = INVITATION_STATUS.REDEEMED;
        return await this.save();
      }

      return Promise.resolve(this);
    },

    async expire(this: InvitationDocument): Promise<InvitationDocument> {
      /** @todo validate past expiration time here? */
      if (this.status === INVITATION_STATUS.PENDING) {
        this.$locals.allowStatusChange = true;
        this.status = INVITATION_STATUS.EXPIRED;
        return await this.save();
      }

      return Promise.resolve(this);
    },

    isValid(this: InvitationDocument): boolean {
      const isExpired = Date.now() > this.expiresAt.getTime();
      return this.status === INVITATION_STATUS.PENDING && !isExpired;
    },

    isRedeemed(this: InvitationDocument): boolean {
      return this.status === INVITATION_STATUS.REDEEMED;
    },
  },
});

invitationSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.$locals.allowStatusChange) {
    next(new Error('Status can only be changed through instance methods'));
    return;
  }
  next();
});


export const Invitation = model<IInvitation, IInvitationModel>('Invitation', invitationSchema);

export function generateInvitationCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars
  let result = '';
  const randomBytes = crypto.randomBytes(6);
  
  for (let i = 0; i < 6; i++) {
    result += characters[randomBytes[i] % characters.length];
  }
  return result;
}