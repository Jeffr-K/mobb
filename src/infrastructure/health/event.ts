// export class HealthCheckCompletedEvent {
//   requestId?: string;
//
//   constructor(public readonly status: string, public readonly timestamp: string, public readonly source: string) {}
// }
//
// export class PerformHealthCheckCommand {
//   requestId?: string;
//
//   constructor(public readonly checkType: string, public readonly params?: Record<string, any>) {}
// }
//
// export class GetHealthStatusQuery {
//   requestId?: string;
//
//   constructor(public readonly detailed: boolean = false) {}
// }
//
// export class OtherEvent {
//   constructor(public readonly data: any) {}
// }
