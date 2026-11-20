import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'iala0u3l',
    dataset: 'production'
  },
  deployment: {
    // Hosted Studio at https://bolcc.sanity.studio — lets `sanity deploy` run without prompting.
    appId: 'jbbcfe2gyv3axr1lpa0l12cc',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
