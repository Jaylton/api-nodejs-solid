export interface Coordinate {
    latitude: number;
    longitude: number;
}

export function getDistanceBetweenCoordinates(
    from: Coordinate,
    to: Coordinate
): number {
    const earthRadius = 6371;

    const latitudeDifference = (to.latitude - from.latitude) * (Math.PI / 180);
    const longitudeDifference = (to.longitude - from.longitude) * (Math.PI / 180);

    const a = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2) +
        Math.cos(from.latitude * (Math.PI / 180)) * Math.cos(to.latitude * (Math.PI / 180)) *
        Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}