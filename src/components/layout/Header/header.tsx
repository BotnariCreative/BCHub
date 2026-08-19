import "./header.css";
import { platform } from "@tauri-apps/plugin-os";

export default function Header() {
    const currentPlatform = platform();

    return(
        <header>
            <div>
                <h1>BCHub</h1>
                <ul>
                    <li className="link active">Projects</li>
                    <li className="link">Calendar</li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <span className="commandBox">/</span> search
                    </li>
                    <li>
                        <span className="commandBox">N</span> new
                    </li>
                    <li>
                        <span className="commandBox"><img src={`/operatingSVGs/${currentPlatform}.svg`} alt="current platform logo" width={10} height={10} />+ K</span> command
                    </li>
                </ul>
            </div>
        </header>
    )
}