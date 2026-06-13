import styles from "./DroneSwarm.module.scss";

const DRONE_CLASSES = [styles.droneOne, styles.droneTwo, styles.droneThree];

export function DroneSwarm() {
  return (
    <div className={styles.swarm} aria-hidden="true">
      {DRONE_CLASSES.map((droneClass, index) => (
        <div key={index} className={`${styles.drone} ${droneClass}`}>
          <span className={styles.beam} />
          <span className={styles.spotlight} />
          <span className={styles.arm} />
          <span className={styles.arm} />
          <span className={styles.propeller} />
          <span className={styles.propeller} />
          <span className={styles.propeller} />
          <span className={styles.propeller} />
          <span className={styles.body} />
          <span className={styles.light} />
        </div>
      ))}
    </div>
  );
}
