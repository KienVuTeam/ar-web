const EventStatus={
    INITIAL: 1,
    BIB: 2,
    SENDMAIL: 3,
    CHECKIN: 4,
    END: 0
}
const EventShow={
    SHOW: 1,
    HIDE: 0
}
const EventRankType={
    GUNTIME: 1,
    CHIPTIME: 0 
}
module.exports={
    EventShow,
    EventStatus,
    EventRankType
}