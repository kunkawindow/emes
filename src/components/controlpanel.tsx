import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import { Save } from "../classes/save";
import { Userbox } from "../classes/userbox";

export interface IBanMenuProps extends React.HTMLProps<any>
{
    save: Save;
    userbox: Userbox;
    onSwitchNotepad: (show: boolean) => void;
}

export interface IBanMenuState
{
    white?: string[];
    black?: string[];
    quarantine?: string[];
    windows?: string[][];
    tab?: string;
    iotextarea?: string;
    input?: string;
    styleFix?: boolean;
    expanded?: boolean;
    useNotepad?: boolean;
}

export class ControlPanel extends React.Component<IBanMenuProps, IBanMenuState>
{
    state: IBanMenuState = {
        white: [],
        black: [],
        quarantine: [],
        windows: [],
        tab: `white`,
        iotextarea: ``,
        input: ``,
        styleFix: true,
        expanded: true,
        useNotepad: true
    };
    
    protected _switchTab(tab: string)
    {
        this.setState({ tab });

        if (tab === `import_export`)
        {
            this.setState({ iotextarea: this.props.save.toJSON() })
        }
    }

    protected _updateTextArea(e: any)
    {
        this.setState({ iotextarea: e.target.value });
    }

    protected _readSaveData()
    {
        var s = this.props.save.data;

        this.setState({
            black: s.lists.black,
            quarantine: s.lists.quarantine,
            white: s.lists.white,
            windows: s.lists.windows,
            styleFix: !!s.styleFix,
            expanded: !!s.expanded,
            useNotepad: !!s.useNotepad
        });

        this._updateFixStyle(!!s.styleFix);

        this.props.onSwitchNotepad(!!s.useNotepad);
    }

    protected _onImport()
    {
        try {
            var save = JSON.parse(this.state.iotextarea) as ISave;
            this.props.save.import(save);
            this.props.save.save();
            this.props.userbox.checkUsers();
            this._readSaveData();
            this._updateFixStyle(save.styleFix);
        }
        catch(e)
        {
            alert(e);
        }
    }

    protected _renderListItem(item: string, index: number | string, isDeep?: boolean)
    {
        if (isDeep)
            return <div onClick={this._onSetInput.bind(this, item)} className={`list-item`} key={index}><span className={`material-icons`}>group</span><span className={`list-item-text`}>{item}</span></div>;

        return <div onClick={this._onSetInput.bind(this, item)} className={`list-item`} key={index}><span className={`list-item-text`}>{item}</span></div>;
    }

    protected _renderList(list: string[] | string[][])
    {
        if (!list || !Array.isArray(list) || !list.length)
            return null;

        var q = _.map(list as any[], (v: string | string[], i: number) => 
        {
            if (Array.isArray(v))
                return _.map(v, (w, k) => this._renderListItem(w, k + "i" + i, k > 0));
            
            return this._renderListItem(v as string, i);
        });
        var r = _.flatten(q);

        return r;
    }

    protected _onUpdateInput(e: any)
    {
        this.setState({ input: e.target.value });
    }

    protected _onSetInput(name: string)
    {
        this.setState({ input: name });
    }

    protected _onSubmit(e: any)
    {
        if (e.repeat || e.keyCode !== 13 /*VK_ENTER*/)
            return;

        if (e.shiftKey)
            this._onRemove();
        else
            this._onAdd();
    }

    protected _onFixStyleSetting(e: any)
    {
        var checked = e.target.checked as boolean;
        this.setState({ styleFix: checked });
        this.props.save.import({ styleFix: checked });
        this.props.save.save();
        this._updateFixStyle(checked);
    }

    protected _onExpand()
    {
        var expanded = !this.state.expanded;
        this.setState({ expanded });
        this.props.save.import({ expanded });
        this.props.save.save();
    }

    protected _onSwitchNotepad()
    {
        var useNotepad = !this.state.useNotepad;
        this.setState({ useNotepad });
        this.props.onSwitchNotepad(useNotepad);
        this.props.save.import({ useNotepad });
        this.props.save.save();
    }

    protected _updateFixStyle(needsFix: boolean)
    {
        var element = document.getElementById(`content`);

        if (!element)
            return;

        element.setAttribute(`emes-stylefix`, needsFix ? `true` : `false`)
    }

    protected _onAdd()
    {
        var input = this.state.input.trim().toLowerCase();
        var tab = this.state.tab;

        if (!input)
            return;

        var list = _.cloneDeep(this.state[tab] as string[] | string[][]);
        var out = { lists: {} as any};

        if (tab !== `windows`)
        {
            if (input.indexOf(" ") !== -1)
                return;

            let simpleList = list as string[];

            if (_.indexOf(simpleList, input) === -1)
                simpleList.push(input);

            out.lists[tab] = simpleList;
        }
        else 
        {
            let deepList = list as string[][];
            let names = input.split(" ").map(v => v.trim()).filter(v => !!v);

            if (names.length < 2)
                return;

            let target = _.findIndex(deepList, v => _.intersection(v, names).length > 0);

            if (target === -1)
            {
                deepList.push(names);
            }
            else
            {
                deepList[target] = _.uniq(deepList[target].concat(names));
            }

            out.lists[tab] = deepList;
        }

        this.props.save.import(out);
        this.props.save.save();
        this.props.userbox.checkUsers();
        this._readSaveData();
        this.setState({ input: `` });
    }

    protected _onRemove()
    {
        var input = this.state.input.trim().toLowerCase();
        var tab = this.state.tab;

        if (!input)
            return;
        
        var list = _.cloneDeep(this.state[tab] as string[] | string[][]);
        var out = { lists: {} as any};

        if (tab !== `windows`)
        {
            if (input.indexOf(" ") !== -1)
                return;

            let simpleList = list as string[];
            let target = _.indexOf(simpleList, input);

            if (target === -1)
                return;

            simpleList.splice(target, 1);
            out.lists[tab] = simpleList;
        }
        else 
        {
            let deepList = list as string[][];
            let names = input.split(" ").map(v => v.trim()).filter(v => !!v);

            let target = _.findIndex(deepList, v => _.intersection(v, names).length > 0);

            if (target === -1)
                return;
            
            let targetList = deepList[target];
            targetList = _.filter(targetList, t => _.indexOf(names, t) === -1);

            if (!targetList || targetList.length >= 2)
                deepList[target] = targetList;
            else
                deepList.splice(target, 1);
            
            out.lists[tab] = deepList;
        }

        this.props.save.import(out);
        this.props.save.save();
        this.props.userbox.checkUsers();
        this._readSaveData();
        this.setState({ input: `` });
    }

    public componentDidMount()
    {
        this._readSaveData();
    }

    public render()
    {
        var JSXList = this._renderList(this.state[this.state.tab]);

        return (
            <div {...this.props} className={`emes-banmenu${ this.state.expanded ? ` expanded` : ``}`}>
                <div className={`emes-banmenu-user-controls`}>
                    <div className={`expand`}>
                        <button onClick={this._onExpand.bind(this)} style={{ display: this.state.expanded ? `` : `none`}}>
                            <span className={`material-icons`}>expand_less</span>
                        </button>
                        <button onClick={this._onExpand.bind(this)} className={`expand`} style={{ display: this.state.expanded ? `none` : ``}}>
                            <span className={`material-icons`}>expand_more</span>
                        </button>
                    </div>
                    <div className={`tabs`} style={{ display: this.state.expanded ? `` : `none`}}>
                        <button onClick={this._switchTab.bind(this, `white`)} title={`White list`} className={this.state.tab === `white` ? `active-tab-button` : null}>
                            <span className={`material-icons`}>thumb_up</span>
                        </button>
                        <button onClick={this._switchTab.bind(this, `black`)} title={`Ban list`} className={this.state.tab === `black` ? `active-tab-button` : null}>
                            <span className={`material-icons`}>report</span>
                        </button>
                        <button onClick={this._switchTab.bind(this, `quarantine`)} title={`Quarantine list`} className={this.state.tab === `quarantine` ? `active-tab-button` : null}>
                            <span className={`material-icons`}>visibility</span>
                        </button>
                        <button onClick={this._switchTab.bind(this, `windows`)} title={`Windows list`} className={this.state.tab === `windows` ? `active-tab-button` : null}>
                            <span className={`material-icons`}>desktop_windows</span>
                        </button>
                        <button onClick={this._switchTab.bind(this, `import_export`)} title={`Import/Export`} className={this.state.tab === `import_export` ? `active-tab-button` : null}>
                            <span className={`material-icons`}>import_export</span>
                        </button>
                        <button onClick={this._switchTab.bind(this, `settings`)} title={`Settings`} className={this.state.tab === `settings` ? `active-tab-button` : null}>
                            <span className={`material-icons`}>settings</span>
                    </button>
                    </div>
                </div>
                <div style={{ display: this.state.expanded ? `` : `none`}}>
                    <div style={{ display: this.state.tab === `import_export` || this.state.tab === `settings` ? `none` : ``}}>
                        <div className={`window-content window-content-active`}>
                            <div className={`scroll-vp`}>
                                { JSXList }
                            </div>
                        </div>
                        <div className={`user-input`}>
                            <input onKeyDown={this._onSubmit.bind(this)} onInput={this._onUpdateInput.bind(this)} value={this.state.input}/>
                            <button onClick={this._onAdd.bind(this)} title={`Add`}><span className={`material-icons`}>add</span></button>
                            <button onClick={this._onRemove.bind(this)} title={`Remove`}><span className={`material-icons`}>remove</span></button>
                        </div>
                    </div>
                    <div style={{ display: this.state.tab === `import_export` ? `` : `none`}}>
                        <textarea spellCheck={`false`} value={this.state.iotextarea} onChange={this._updateTextArea.bind(this)} className={`window-content window-content-active io-textarea`}/>
                        <div className={`import-input`}>
                            <button onClick={this._onImport.bind(this)} title={`Import`}><span className={`material-icons`}>done</span></button>
                        </div>
                    </div>
                    <div style={{ display: this.state.tab === `settings` ? `` : `none`}}>
                        <div className={`window-content window-content-active noscroll`}>
                            <div className={`material-checkbox`}>
                                <label>
                                    <input onChange={this._onFixStyleSetting.bind(this)} checked={this.state.styleFix} type={`checkbox`} id={`setting-checkbox-fix-style`}/>
                                    <span className={`material-icons checked`}>check_box</span>
                                    <span className={`material-icons unchecked`}>check_box_outline_blank</span>
                                </label>
                                <label htmlFor={`setting-checkbox-fix-style`}>Use style changes</label>
                            </div>
                            <div className={`material-checkbox`}>
                                <label>
                                    <input onChange={this._onSwitchNotepad.bind(this)} checked={this.state.useNotepad} type={`checkbox`} id={`setting-checkbox-use-notepad`}/>
                                    <span className={`material-icons checked`}>check_box</span>
                                    <span className={`material-icons unchecked`}>check_box_outline_blank</span>
                                </label>
                                <label htmlFor={`setting-checkbox-use-notepad`}>Use notepad</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}