export interface LeaveReqByYearModel {
    january: LeaveRequestStatusModel,
    february: LeaveRequestStatusModel,
    march: LeaveRequestStatusModel,
    april: LeaveRequestStatusModel,
    may: LeaveRequestStatusModel,
    june: LeaveRequestStatusModel,
    july: LeaveRequestStatusModel,
    august: LeaveRequestStatusModel,
    september: LeaveRequestStatusModel,
    octomber: LeaveRequestStatusModel,
    november: LeaveRequestStatusModel,
    december: LeaveRequestStatusModel,
}

export interface EModel {
    name : string,
    number : number
}



export interface LeaveRequestStatusModel {
    appliedLeaveRequests: number,
    acceptedLeaveRequests: number,
    rejectedLeaveRequests: number,
    pendingLeaveRequests: number
}
