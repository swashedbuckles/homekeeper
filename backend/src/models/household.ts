import { Schema, model, Model, Types, HydratedDocument } from 'mongoose';
import { User, type UserDocument } from './user';
import type { HouseholdRoles, MemberDetail, SerializedHousehold } from '@homekeeper/shared';

export interface IHousehold {
  _id: Types.ObjectId;
  id: string;
  name: string;
  description?: string;
  ownerId: Types.ObjectId;
  members: Types.ObjectId[];
}

export interface IHouseholdMethods {
  serialize(this: HouseholdDocument): SerializedHousehold;
  addMember(member: string, role: HouseholdRoles): Promise<HouseholdDocument>;
  removeMember(member: string): Promise<HouseholdDocument>;
  hasMember(member: string): boolean;
  getMembers(): Promise<MemberDetail[]>;
}

export interface IHouseholdModel extends Model<IHousehold, object, IHouseholdMethods> {
  createHousehold(name: string, owner: string, description?: string): Promise<HouseholdDocument>;
  findByMember(member: string): Promise<HouseholdDocument[]>;
  findByOwner(owner: string): Promise<HouseholdDocument[]>;
}

export type HouseholdDocument = HydratedDocument<IHousehold, IHouseholdMethods>;

const householdSchema = new Schema<IHousehold, IHouseholdModel, IHouseholdMethods>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },

  statics: {
    async createHousehold(name: string, owner: string, description?: string): Promise<HouseholdDocument> {
      const ownerId = new Types.ObjectId(owner);
      const household = new this({
        name,
        description,
        ownerId,
        members: [ownerId]
      });

      // Save household first to generate _id
      const savedHousehold = await household.save();

      const user = await User.findById(ownerId).exec();
      if (!user) {
        throw new Error('User somehow not found');
      }

      await user.addHouseholdRole(savedHousehold._id.toString(), 'owner');

      return savedHousehold as HouseholdDocument;
    },

    async findByMember(member: string): Promise<HouseholdDocument[]> {
      const asObjectId = new Types.ObjectId(member);
      return this.find<HouseholdDocument>({ members: asObjectId }).populate('ownerId members').exec();
    },

    async findByOwner(owner: string): Promise<HouseholdDocument[]> {
      const asObjectId = new Types.ObjectId(owner);
      return this.find<HouseholdDocument>({ ownerId: asObjectId }).populate('ownerId members').exec();
    }
  },

  methods: {
    serialize(this: HouseholdDocument): SerializedHousehold {
      return {
        id: this._id.toString(),
        name: this.name,
        description: this.description,
        ownerId: this.ownerId.toString(),
        members: this.members.map(x => x.toString())
      };
    },

    async getMembers() {
      const memberIds = this.members;
      const users = await User.find({ _id: { $in: memberIds } }, 'name householdRoles').exec();

      const members = users.map(user => {
        const role = user.householdRoles.get(this._id.toString());
        if (!role) {
          throw new Error('User missing household role');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          role,
        };
      });

      return members;
    },

    hasMember(this: HouseholdDocument, member: string): boolean {
      const asObjectId = new Types.ObjectId(member);
      return this.members.includes(asObjectId);
    },

    async addMember(this: HouseholdDocument, member: string, role: HouseholdRoles): Promise<HouseholdDocument> {
      const asObjectId = new Types.ObjectId(member);

      if (this.hasMember(member)) {
        throw new Error('User is already a member');
      }

      const user = await User.findById<UserDocument>(asObjectId);
      if (!user) {
        throw new Error('User not found');
      }

      try {
        this.members.push(asObjectId);
        await this.save();
      } catch (error) {
        console.error('Error saving household', error);
        throw error;
      }

      try {
        await user.addHouseholdRole(this._id.toString(), role);
        await user.save();
      } catch (error) {
        console.error('Error adding member info to user ', user, error);
        throw error;
      }

      return this;
    },

    async removeMember(this: HouseholdDocument, member: string): Promise<HouseholdDocument> {
      const asObjectId = new Types.ObjectId(member);

      if (!this.hasMember(member)) {
        throw new Error('User is already not a member');
      }

      const user = await User.findById<UserDocument>(asObjectId);
      if (!user) {
        throw new Error('User not found');
      }

      try {
        this.members = this.members.filter(member => !member.equals(asObjectId));
        await this.save();
      } catch (error) {
        console.error('Error saving household', error);
        throw error;
      }

      try {
        await user.removeHouseholdRole(this._id.toString());
      } catch (error) {
        console.error('Error adding member info to user ', user, error);
        throw error;
      }

      return this;
    }
  },

});

export const Household = model<IHousehold, IHouseholdModel>('Household', householdSchema);
