import * as _ from "lodash";
import { Save } from "./save";
import { DomObserver } from "./dom";

export class Userbox
{
    constructor(protected _save: Save, protected _dom: DomObserver, protected _userbox: Element)
    {
        this._save.load();

        this._dom.onAdd = () => 
        {
            this.checkUsers();
        };

        this._dom.onRemove = (e) => 
        {
            
        };

        this._dom.start();
    }

    public checkUsers()
    {
        if (!this._userbox)
            return;

        var nodes = this._userbox.querySelectorAll("[data-uname]");
        var i = nodes.length;
        var lists = this._save.data.lists;

        while (i--)        
        {
            var userName = (nodes[i].getAttribute("data-uname") || "").trim().toLowerCase();

            if (!userName)
                continue;

            if (lists.black.indexOf(userName) !== -1)
            {
                nodes[i].setAttribute("emes-user", "banned");
            }
            else if (lists.quarantine.indexOf(userName) !== -1)
            {
                nodes[i].setAttribute("emes-user", "quarantine");
            }
            else if (_.findIndex(lists.windows, (a => a.indexOf(userName) !== -1)) !== -1)
            {
                nodes[i].setAttribute("emes-user", "window");
            }
            else if (lists.white.indexOf(userName) !== -1)
            {
                nodes[i].setAttribute("emes-user", "white");
            }
            else
            {
                nodes[i].setAttribute("emes-user", "noname");
            }
        }
    }
}