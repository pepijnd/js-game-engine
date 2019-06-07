import Obj from "object";
import EventTypes from 'engine/events';

export default class ObjLightning extends Obj {
    setEvents() {
        this.onEvent(EventTypes.CREATE, () => {
            window.fluid.init();
            /*
            particle_count: usize,
            width: usize, height: usize,
            time_scale: u32,
            gravity: f32, interaction_radius: f32,
            stiffness: f32, stiffness_near: f32, rest_density: f32,*/
            this.jsfluid = new window.fluid.JSFluid(500, 800, 600, 60, 35, 15, 60, 100, 5);
        });

        this.onEvent(EventTypes.STEP, () => {
            this.jsfluid.update();
        });

        this.onEvent(EventTypes.DRAW, (context) => {
            let particles = this.jsfluid.get_particles();
            let x = particles.get_x();
            let y = particles.get_y();
            for (let i = 0; i < x.length; i++) {
                context.drawRect(x[i] - 15, y[i] - 15, 30, 30, "#2424F4")
            }
        })
    }
}
