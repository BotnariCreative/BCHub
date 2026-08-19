import "./projectCard.css";

export default function ProjectCard({title, description} : {title : string; description: string}) {
    return (
        <div className="Card">
            <div className="CardTop">
                <p className="CardTitle">{title}</p>
                <p className="CardDescription TextPadding">{description}</p>
            </div>
            <div className="line"></div>
            <div className="CardStatus">
                <div>
                    <p className="CardDescription TextPadding">Branch</p>
                    <p className="TextPadding">main</p>
                </div>
                <div>
                    <p className="CardDescription TextPadding">Tasks</p>
                    <p className="TextPadding">3 Open</p>
                </div>
            </div>
            <div className="line"></div>
            <div className="CardBottom">
                <p>a3f9e1b</p>
                <div className="LastOpened">
                    <p>Last opened: 14:39 24.08.2026</p>
                    <p className="commandBox"><img src="/symbols/EnterKey.svg" alt="EnterKey" width={10} height={10}/></p>
                </div>
            </div>
        </div>

    )
}