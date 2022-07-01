import "./Message.css";

interface IMessage {
    message: string;
    img: string;
    side: string;
    person: string;
}

const Message = ({ message, img, side, person }: IMessage) => {
    return (
        <div className={`message ${side}`}>
            <img src={img} className="messageImg" />
            <div className="messageText">
                <h4>{person}</h4>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default Message;