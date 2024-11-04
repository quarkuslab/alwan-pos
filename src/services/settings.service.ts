const SettingsService = {
  async setToken(id: string) {
    if (window.SettingsBridge) {
      await window.SettingsBridge.saveString('token', id)
    }
  },

  async getToken() {
    if (window.SettingsBridge) {
      return window.SettingsBridge.getString('token')
    }
    return null
  },
}

export default SettingsService