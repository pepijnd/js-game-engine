export default function Property(controller, callback, target={}) {
    let property = target ? target : {};
    return new Proxy(property, {
        get: (target, key, receiver) => {
            return target[key];
        },
        set: (target, key, value, receiver) => {
            target[key] = value;
            callback(controller, receiver)
        }
    });
}