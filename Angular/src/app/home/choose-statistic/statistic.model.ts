export class Statistic {
    public country: string;
    public statistic: string;
    public fromYear: number;
    public toYear: number;
    public sex: string;
    public age: string;
    public ageGroup: string;
    public fertilityAgeGroup: string;

    constructor(_country: string, _statistic: string, _fromYear:number, 
        _toYear: number, _sex: string, _age: string, _ageGroup: string,
        _fertilityAgeGroup: string) {
            this.country = _country;
            this.statistic = _statistic;
            this.fromYear = _fromYear;
            this.toYear = _toYear;
            this.sex = _sex;
            this.age = _age;
            this.ageGroup = _ageGroup;
            this.fertilityAgeGroup = _fertilityAgeGroup;
    }
}