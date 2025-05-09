import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      fname: '',
      lname: '',
      fullName: '',
      email: '',
      thumbnail: '',
      role: '',
      phone: '',
      bio: '',
      country: '',
      city: '',
    }
  }),
  actions: {
    setUserData(data: any) {
      this.user = { ...this.user, ...data };
    },
    setThumbnail(thumbnail: string) {
      this.user.thumbnail = thumbnail;
    }
  }
});

