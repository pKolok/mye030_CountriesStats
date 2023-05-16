export class Statistic {
    public country: string;
    public statistic: string;
    public fromYear: number;
    public toYear: number;
    public sex: string;
    public age: string;
    public ageGroup: string;
    public fertilityAgeGroup: string;

    constructor(_country: string, _statistic: string, _fromYear?: number, 
        _toYear?: number, _sex?: string, _age?: string, _ageGroup?: string,
        _fertilityAgeGroup?: string) {
            this.country = _country;
            this.statistic = _statistic;
            this.fromYear = _fromYear ? _fromYear : null;
            this.toYear = _toYear ? _toYear : null;
            this.sex = _sex ? _sex : null;
            this.age = _age ? _age : null;
            this.ageGroup = _ageGroup ? _ageGroup : null;
            this.fertilityAgeGroup = _fertilityAgeGroup ? _fertilityAgeGroup : null;
    }

    public clone() {
        return new Statistic(this.country, this.statistic, this.fromYear,
            this.toYear, this.sex, this.age, this.ageGroup,
            this.fertilityAgeGroup);
    }
}