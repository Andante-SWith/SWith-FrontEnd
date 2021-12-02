import { atom, selector } from 'recoil';

const studyRoomAtoms = {
  studyRoomId: atom({
    key: 'studyRoomId',
    default: '',
  }),

  userInfo: atom({
    key: 'userInfo',
    default: null,
  }),

  userNickName: atom({
    key: 'userNickName',
    default: '',
  }),

  userTimer: atom({
    key: 'userTimer',
    default: new Map(),
  }),

  PCs: atom({
    key: 'PCs',
    default: new Map(),
  }),

  RTCSenders: atom({
    key: 'RTCSenders',
    default: new Map(),
  }),

  connectedUsers: atom({
    key: 'connnectedUsers',
    default: [],
  }),

  connectedUserTimer: atom({
    key: 'connectedUserTimer',
    default: new Map(),
  }),

  userAudioMute: atom({
    key: 'userAudioMute',
    default: new Map(),
  }),

  userVideoMute: atom({
    key: 'userVideoMute',
    default: new Map(),
  }),

  enlargeVideo: atom({
    key: 'enlargeVideo',
    default: false,
  }),

  enlargedUserSocketId: atom({
    key: 'enlargedUserSocketId',
    default: '',
  }),

  kicked: atom({
    key: 'kicked',
    default: false,
  }),
};

const studyRoomSelectors = {};

export { studyRoomAtoms, studyRoomSelectors };
