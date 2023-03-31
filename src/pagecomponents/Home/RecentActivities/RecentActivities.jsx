import { Steps } from "antd";
import React from "react";
import styles from "./RecentActivities.module.css";

function RecentActivities({ logs }) {
  // getting time and date
  const getTimeAndDate = (timeStamp) => {
    const date = new Date(parseInt(timeStamp * 1000));
    const monthyear = date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    const time = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "numeric",
    });
    return monthyear + ", " + time;
  };
  return (
    <div className={styles.container}>
      <div className="heading-tab" style={{ marginLeft: "10px" }}>
        Recent Activities
      </div>
      <div className={styles.stepContainer}>
        {logs.map((dat, i) => (
          <div className={styles.wrapStep} key={i}>
            <div>
              {dat?.type}(<span>{dat?.action}</span>):
              <span>{getTimeAndDate(dat?.timestamp)}</span>
            </div>
            <div>{dat.time}</div>
            <div className={styles.hr} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivities;
