import loglevel from 'loglevel';
import prefixer from 'loglevel-plugin-prefix'

const DEFAULT_LEVEL = import.meta.env.PROD ? 'INFO' : 'DEBUG';
loglevel.setDefaultLevel(DEFAULT_LEVEL);

export const API   = loglevel.getLogger('API');
export const UI    = loglevel.getLogger('UI');
export const STATE = loglevel.getLogger('STATE');
export const HOOKS = loglevel.getLogger('HOOKS');

prefixer.reg(API);
prefixer.apply(API, {template: '[API]'});

prefixer.reg(UI);
prefixer.apply(UI, {template: '[UI]'});

prefixer.reg(STATE);
prefixer.apply(STATE, {template: '[STATE]'});

prefixer.reg(HOOKS);
prefixer.apply(HOOKS, {template: '[HOOKS]'});

