import dayjs from "dayjs";

export default async function calcQualified(birthDate: Date) {
    const dateBirth = dayjs(birthDate);
    const dateNow = dayjs(Date.now());
    const calcDiff = dateNow.diff(dateBirth, "year");
    if (calcDiff >= 18) {
        return true;
    }
    return false;
}