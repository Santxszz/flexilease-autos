export default interface IReserveCreate {
	startDate: Date;
	endDate: Date;
    finalValue?: number;
	carId: number;
    userId?: number;
    tokenUser: string;
}
