const EventTypeValues = {};

class EventType {
    constructor() {
        this.value = Symbol();
        EventTypeValues[this.value] = this;
    }

    static event_get(event) {
        if(EventTypeValues[event.value]) {
            return EventTypeValues[event.value];
        }
        return EventType.UNKNOWN;
    }
}

EventType.UNKNOWN           = new EventType();
EventType.CREATE            = new EventType();
EventType.BEGINSTEP         = new EventType();
EventType.COLLISION         = new EventType();
EventType.STEP              = new EventType();
EventType.ENDSTEP           = new EventType();
EventType.DRAW              = new EventType();

export default EventType