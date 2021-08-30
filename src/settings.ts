import { App, PluginSettingTab, Plugin_2 } from "obsidian";
import { SettingModel, SettingModelBuilder, TimeSerde, RawSerde, LatersSerde } from "model/settings";
import { Time, Later } from "model/time";

class SettingGroup {
  constructor(public name: string, public settings: Array<SettingModel<any, any>>) {
  }
}

class Settings {

  groups: Array<SettingGroup> = [];
  reminderTime: SettingModel<string, Time>;
  useSystemNotification: SettingModel<boolean, boolean>;
  laters: SettingModel<string, Array<Later>>;

  constructor() {
    this.reminderTime = this.builder()
      .key("reminderTime")
      .name("Reminder Time")
      .desc("Time when a reminder with no time part will show")
      .text("09:00")
      .placeHolder("Time (hh:mm)")
      .build(new TimeSerde());

    this.useSystemNotification = this.builder()
      .key("useSystemNotification")
      .name("Use system notification")
      .desc("Use system notification for reminder notifications")
      .toggle(false)
      .build(new RawSerde());

    this.laters = this.builder()
      .key("laters")
      .name("Remind me later")
      .desc("Line-separated list of remind me later items")
      .textArea("In 30 minutes\nIn 1 hour\nIn 3 hours\nTomorrow\nNext week")
      .placeHolder("In 30 minutes\nIn 1 hour\nIn 3 hours\nTomorrow\nNext week")
      .build(new LatersSerde());

    this.groups.push(new SettingGroup("Reminder Settings", [
      this.reminderTime,
      this.laters
    ]));
    this.groups.push(new SettingGroup("Notification Settings", [
      this.useSystemNotification
    ]));
  }

  public forEach(consumer: (setting: SettingModel<any, any>) => void) {
    this.groups.forEach(group => {
      group.settings.forEach(setting => {
        consumer(setting);
      })
    })
  }

  private builder(): SettingModelBuilder {
    return new SettingModelBuilder();
  }
}

export const SETTINGS = new Settings();

export class ReminderSettingTab extends PluginSettingTab {
  constructor(
    app: App,
    plugin: Plugin_2
  ) {
    super(app, plugin);
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    SETTINGS.groups.forEach(group => {
      containerEl.createEl('h3', { text: group.name });
      group.settings.forEach(settings => {
        settings.createSetting(containerEl);
      });
    })
  }
}