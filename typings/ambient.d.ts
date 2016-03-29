declare function GM_setValue(name: string, value: string): void;
declare function GM_getValue(name: string, defaultValue?: string): string;

declare interface ISave
{
    lists?: {
        white?: string[];
        black?: string[];
        quarantine?: string[];
        windows?: string[][];
    };
    notepad?: string;
    notepadSettings?: {
        width: number;
        height: number;
    };
    styleFix?: boolean;
    expanded?: boolean;
    useNotepad?: boolean;
}