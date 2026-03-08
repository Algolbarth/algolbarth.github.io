export class stringlang {
    fr: string;
    en: string;

    constructor(fr: string, en: string) {
        this.fr = fr;
        this.en = en;
    };

    print(lang: string) {
        if (lang == "fr") {
            return this.fr;
        }
        else if (lang == "en") {
            return this.en;
        }
    };
};