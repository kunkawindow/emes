export class DomObserver
{
    private _target: HTMLElement;
    private _active: boolean = false;
    private _domChangeObserver: MutationObserver = null;
    private _handlerAdd: any = null;
    private _handlerRemove: any = null;

    public onAdd: (elements: HTMLElement[]) => void;
    public onRemove: (elements: HTMLElement[]) => void;

    constructor(target: HTMLElement)
    {
        this._target = target;
    }

    public start(lookTree?: boolean)
    {
        if (this._active || !this.onAdd || !this.onRemove || !this._target)
            return;

        this._active = true;

        var target = this._target;

        if (typeof MutationObserver !== "undefined")
        {
            this._domChangeObserver = new MutationObserver((mutations) =>
            {
                mutations.forEach((mutation) =>
                {
                    if (mutation.addedNodes[0])
                        this.onAdd(<any>mutation.addedNodes);

                    if (mutation.removedNodes[0])
                        this.onRemove(<any>mutation.removedNodes);
                });
            });

            this._domChangeObserver.observe(target, {
                attributes: false,
                childList: true,
                characterData: true,
                subtree: true
            });
        }
        else
        {
            this._handlerAdd = (e) =>
            {
                this.onAdd([e.target]);
            };

            this._handlerRemove = (e) =>
            {
                this.onRemove([e.target]);
            };

            target.addEventListener("DOMNodeInserted", this._handlerAdd, false);
            target.addEventListener("DOMNodeRemoved", this._handlerRemove, false);
        }
    }

    public stop()
    {
        if (!this._active)
            return;

        this._active = false;

        if (this._domChangeObserver)
        {
            this._domChangeObserver.disconnect();
            this._domChangeObserver = null;
        }
        else
        {
            this._target.removeEventListener("DOMNodeInserted", this._handlerAdd, false);
            this._target.removeEventListener("DOMNodeRemoved", this._handlerRemove, false);
            this._handlerAdd = null;
            this._handlerRemove = null;
        }
    }

    public release()
    {
        this.stop();

        this._target = null;
        this._active = null;
        this._domChangeObserver = null;
        this._handlerAdd = null;
        this._handlerRemove = null;
    }
}