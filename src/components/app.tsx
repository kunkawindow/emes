import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import { Save } from "../classes/save";
import { DomObserver } from "../classes/dom";
import { Userbox } from "../classes/userbox";
import { ControlPanel } from "../components/controlpanel";
import { Notepad } from "../components/notepad";

export interface IAppProps extends React.HTMLProps<any>
{
    userbox: Element;
}

export interface IAppState
{
    showNotepad?: boolean;
}

export class App extends React.Component<IAppProps, IAppState>
{
    state: IAppState = {
        showNotepad: true    
    };

    protected _saveCtrl: Save;
    protected _userboxCtrl: Userbox;
    protected _domCtrl: DomObserver;

    constructor(props: IAppProps, context?: any)
    {
        super(props, context);

        this._saveCtrl = new Save();
        this._domCtrl = new DomObserver(this.props.userbox as HTMLElement);
        this._userboxCtrl = new Userbox(this._saveCtrl, this._domCtrl, this.props.userbox);
    }
    
    protected _onShowNotepad(show: boolean)
    {
        this.setState({ showNotepad: show });
    }

    public componentDidMount()
    {
        
    }

    public render()
    {
        return (
            <div className={`emes-sub-root`}>
                <ControlPanel userbox={this._userboxCtrl} save={this._saveCtrl} onSwitchNotepad={this._onShowNotepad.bind(this)}/>
                <Notepad save={this._saveCtrl} style={{ display: this.state.showNotepad ? `` : `none` }}/>
            </div>
        );
    }
}