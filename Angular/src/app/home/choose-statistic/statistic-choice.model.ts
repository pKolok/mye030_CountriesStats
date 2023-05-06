export class StatisticChoice {
    public country: string;
    public statistic: string;
    public sex: string;
    public age: string;
    public ageGroup: string;
    public fertilityAgeGroup: string;

    constructor(_country: string, _statistic: string, _sex: string,
        _age: string, _ageGroup: string, _fertilityAgeGroup: string) {
            this.country = _country;
            this.statistic = _statistic;
            this.sex = _sex;
            this.age = _age;
            this.ageGroup = _ageGroup;
            this.fertilityAgeGroup = _fertilityAgeGroup; 
        }
}