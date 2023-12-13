export interface ChatMessagesType {
    id:                    string;
    message:               string;
    response:              string;
    modified_at_formatted: string;
}

export interface ChatType {
    id:                     string;
    messages:               ChatMessagesType[];
    created_by:             string;
    modified_at_formatted:  string;
}