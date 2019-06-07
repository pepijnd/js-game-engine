const EventTypeValues = {};

class EventType {
    constructor(value) {
        this.value = value || Symbol();
        EventTypeValues[this.value] = this;
    }

    static event_get(event) {
        if(EventTypeValues[event.value]) {
            return EventTypeValues[event.value];
        }
        return EventType.UNKNOWN;
    }

    get id() {
        return this.value;
    }
}

EventType.UNKNOWN           = new EventType('UNKNOWN');
EventType.CREATE            = new EventType('CREATE');
EventType.BEGINSTEP         = new EventType('BEGINSTEP');
EventType.COLLISION         = new EventType('COLLISION');
EventType.STEP              = new EventType('STEP');
EventType.ENDSTEP           = new EventType('ENDSTEP');
EventType.DRAW              = new EventType('DRAW');

export default EventType