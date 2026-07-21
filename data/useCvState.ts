import { reactive, toRefs } from 'vue'
import {
  //cvBackendDevOpsTemplate,
  //cvSettingTemplate,
  cvSettingTemplateEs,
  cvSettingsEmptyTemplate,
} from './example-cv-settings'
import {
  type Cv,
  type CvEvent,
  type DefaultSkill,
  type LanguagesSkill,
  type SectionName,
  SectionNameList,
} from '~/types/cvfy'

const state = reactive({
  formSettings: { ...cvSettingsEmptyTemplate } as Cv,
  isLoading: true,
  isProfilePhotoLoading: false,
})

export function useCvState() {
  const i18n = useI18n()
  const route = useRoute()

  function getStorageKey(): string {
    return route.query.mode === 'adapted'
      ? `cvSettings-adapted-${i18n.locale.value}`
      : `cvSettings-${i18n.locale.value}`
  }

  function setUpCvSettings(): void {
    const storageKey = getStorageKey()
    const cvSettings = localStorage.getItem(storageKey)

    if (cvSettings == null) {
      state.formSettings = {
        ...cvSettingTemplateEs,
      }
    }
    else {
      const cvSettingsObj = JSON.parse(cvSettings)
      state.formSettings = { ...cvSettingsEmptyTemplate, ...cvSettingsObj }
      patchId(state.formSettings)
      patchDisplayDate(state.formSettings)
    }

    // In adapted mode, load profile image from base CV if missing
    if (route.query.mode === 'adapted' && !state.formSettings.profileImageDataUri) {
      const baseKey = `cvSettings-${i18n.locale.value}`
      const baseCvSettings = localStorage.getItem(baseKey)
      if (baseCvSettings) {
        const baseObj = JSON.parse(baseCvSettings)
        if (baseObj.profileImageDataUri) {
          state.formSettings.profileImageDataUri = baseObj.profileImageDataUri
        }
      }
    }

    // If still no avatar in adapted mode, try other locales' base CVs
    if (route.query.mode === 'adapted' && !state.formSettings.profileImageDataUri) {
      const otherLocales = ['es', 'en', 'pt'].filter(l => l !== i18n.locale.value)
      for (const loc of otherLocales) {
        const baseCvSettings = localStorage.getItem(`cvSettings-${loc}`)
        if (baseCvSettings) {
          const baseObj = JSON.parse(baseCvSettings)
          if (baseObj.profileImageDataUri) {
            state.formSettings.profileImageDataUri = baseObj.profileImageDataUri
            break
          }
        }
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(state.formSettings))
    state.isLoading = false
  }

  function addSkill<T extends LanguagesSkill | DefaultSkill>(e: T): void {
    if (e.skillType === 'languages') {
      if (e.skill.lang.trim() === '')
        return
      const newLang = e.skill
      const newLangIdx = state.formSettings.languages.findIndex(
        lang => lang.lang === newLang.lang,
      )
      if (newLangIdx < 0) {
        state.formSettings.languages = [
          ...new Set([
            ...state.formSettings.languages,
            { lang: e.skill.lang, level: e.skill.level },
          ]),
        ]
      }
    }
    else {
      if (e.skill.trim() === '')
        return
      state.formSettings[e.skillType] = [
        ...new Set([...state.formSettings[e.skillType], e.skill]),
      ]
    }
  }

  function removeSkill<T extends LanguagesSkill | DefaultSkill>(e: T): void {
    if (e.skillType === 'languages') {
      state.formSettings[e.skillType] = [
        ...state.formSettings[e.skillType].filter(
          skill => skill.lang !== e.skill.lang,
        ),
      ]
    }
    else {
      state.formSettings[e.skillType] = [
        ...state.formSettings[e.skillType].filter(skill => skill !== e.skill),
      ]
    }
  }

  function addEntry(e: { sectionName: SectionName }) {
    state.formSettings[e.sectionName].unshift({
      id: crypto.randomUUID(),
      title: '',
      location: '',
      from: new Date(),
      to: new Date(),
      current: false,
      summary: '',
      displayDate: e.sectionName !== 'education',
    })
  }

  function removeEntry(e: { sectionName: SectionName, entry: CvEvent }) {
    state.formSettings[e.sectionName] = state.formSettings[
      e.sectionName
    ].filter(entry => entry.id !== e.entry.id)
  }

  function uploadCV(e: any): void {
    const fr = new FileReader()
    fr.onload = (e: any) => {
      const data = JSON.parse(e.target.result)
      state.formSettings = {
        ...cvSettingsEmptyTemplate,
        ...data.formSettings,
      }
      patchId(state.formSettings)
      patchDisplayDate(state.formSettings)
    }
    fr.readAsText(e.target.files[0])
  }

  function resetForm(): void {
    state.formSettings = {
      ...cvSettingTemplateEs,
    }
    localStorage.setItem(
      getStorageKey(),
      JSON.stringify(state.formSettings),
    )
  }

  function clearForm(): void {
    state.formSettings = cvSettingsEmptyTemplate
    localStorage.removeItem(getStorageKey())
  }

  function saveAdaptedCv(adaptedCv: Cv): void {
    const merged = {
      ...cvSettingsEmptyTemplate,
      ...adaptedCv,
    }
    // Remove profileImageDataUri from adapted CV to avoid duplicating
    // large base64 images across 3 localStorage keys and exceeding quota
    delete (merged as any).profileImageDataUri
    patchId(merged)
    patchDisplayDate(merged)
    const activeLocales = ['es', 'en', 'pt']
    activeLocales.forEach((locale) => {
      localStorage.setItem(`cvSettings-adapted-${locale}`, JSON.stringify(merged))
    })
  }

  function changeDisplaySection(e: {
    sectionName: string
    status: boolean
  }): void {
    const propName = `display${e.sectionName
      .slice(0, 1)
      .toUpperCase()}${e.sectionName.slice(1)}` as
      | 'displayEducation'
      | 'displayProjects'
      | 'displayJobSkills'
      | 'displaySoftSkills'
      | 'displayLanguages'
    state.formSettings[propName] = e.status
  }

  function patchId(formSettings: Cv) {
    // Make sure that older cvs have id in each entry of a section
    for (const key in SectionNameList) {
      const section = key as SectionName
      for (const e of formSettings[section]) {
        if (!e.id) {
          e.id = crypto.randomUUID()
        }
      }
    }
  }

  function patchDisplayDate(formSettings: Cv) {
    // Make sure that older cvs have the correct default displayDate
    for (const key in SectionNameList) {
      const section = key as SectionName
      for (const e of formSettings[section]) {
        if (e.displayDate == null) {
          e.displayDate = section !== 'education'
        }
      }
    }
  }

  return {
    ...toRefs(state),
    setUpCvSettings,
    getStorageKey,
    saveAdaptedCv,
    addSkill,
    removeSkill,
    addEntry,
    removeEntry,
    uploadCV,
    resetForm,
    clearForm,
    changeDisplaySection,
  }
}
