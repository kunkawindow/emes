export class Save
{
    protected _isGM = typeof GM_getValue === "function";
    protected _data: ISave = {
        lists: {
            black: [],
            quarantine: [],
            white: [],
            windows: []
        },
        notepad: ``,
        notepadSettings: {
            height: 300,
            width: 150
        },
        styleFix: true,
        expanded: true,
        useNotepad: true
    };

    constructor()
    {
    }

    public get data()
    {
        return this._data;
    }

    protected _get(name: string, defaultValue: string)
    {
        if (this._isGM)
            return GM_getValue(name, defaultValue);

        return window.localStorage.getItem(name) || defaultValue;
    }

    protected _set(name: string, value: string)
    {
        if (this._isGM)
            GM_setValue(name, value);
        else
            window.localStorage.setItem(name, value);
    }

    public toJSON()
    {
        return JSON.stringify(this._data);
    }

    public import(save: ISave)
    {
        if (!save)
            return;

        if (save.lists)
        {
            if (save.lists.black instanceof Array)
                this._data.lists.black = save.lists.black.map(v => v.toLowerCase()).filter(v => v !== `kunka`);

            if (save.lists.quarantine instanceof Array)
                this._data.lists.quarantine = save.lists.quarantine.map(v => v.toLowerCase()).filter(v => v !== `kunka`);

            if (save.lists.white instanceof Array)
                this._data.lists.white = save.lists.white.map(v => v.toLowerCase());

            if (save.lists.windows instanceof Array)
                this._data.lists.windows = save.lists.windows.map(v => v.map(u => u.toLowerCase())).filter(v => v.indexOf(`kunka`) === -1);
        }

        if (typeof save.notepad === `string`)
            this._data.notepad = save.notepad;

        if (typeof save.styleFix === `boolean`)
            this._data.styleFix = save.styleFix;

        if (typeof save.expanded === `boolean`)
            this._data.expanded = save.expanded;

        if (typeof save.useNotepad === `boolean`)
            this._data.useNotepad = save.useNotepad;

        if (typeof save.notepadSettings === `object` && save.notepadSettings)
            this._data.notepadSettings = save.notepadSettings;
    }

    public load()
    {
        var save = this._get(`emesdata`, JSON.stringify({
            lists: {
                white: [],
                black: [],
                quarantine: [],
                windows: []
            },
            notepad: "", 
            notepadSettings: {
                height: 300,
                width: 150
            },
            styleFix: true,
            expanded: true,
            useNotepad: true
        } as ISave));
        this._data = JSON.parse(save) as ISave;
        return this;
    }

    public save()
    {
        this._set(`emesdata`, JSON.stringify(this._data));
        return this;
    }
}