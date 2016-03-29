import * as React from "react";
import * as ReactDOM from "react-dom";
import * as _ from "lodash";
import { Save } from "../classes/save";
import { Userbox } from "../classes/userbox";

export interface INotepadProps extends React.HTMLProps<any>
{
    save: Save;
}

export interface INotepadState
{
    iotextarea?: string;
}

export class Notepad extends React.Component<INotepadProps, INotepadState>
{
    state: INotepadState = {
        iotextarea: ``,
    };
    
    protected _updateTextArea(e: any)
    {
        var text = e.target.value;
        
        var ta = this.refs["editor"] as HTMLTextAreaElement;

        this.setState({ iotextarea: text });
        this.props.save.import({ 
            notepad: text, 
            notepadSettings: {
                width: ta.offsetWidth, 
                height: ta.offsetHeight
            }
        });
        this.props.save.save();
    }

    protected _readSaveData()
    {
        var s = this.props.save.data;

        if (s.notepadSettings)
        {
            var ta = this.refs["editor"] as HTMLTextAreaElement;
            ta.style.width = `${s.notepadSettings.width}px`;
            ta.style.height = `${s.notepadSettings.height}px`;
        }

        this.setState({
            iotextarea: s.notepad
        });
    }

    public componentDidMount()
    {
        this._readSaveData();
    }

    public render()
    {
        return (
            <div {...this.props} className={`emes-notepad`}>
                <div className={`emes-notepad-title`}>Notepad</div>
                <textarea ref={`editor`} spellCheck={`false`} value={this.state.iotextarea} onChange={this._updateTextArea.bind(this)} className={`io-textarea`}/>
            </div>
        );
    }
}