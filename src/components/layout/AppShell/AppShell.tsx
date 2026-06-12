import type { ReactNode } from "react";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";
import styles from "./AppShell.module.scss";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
