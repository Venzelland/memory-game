import React from "react";

const Card = ({ card, handleClick, isFlipped, isMatched, isSelected }) => {
    const handleCardClick = () => {
        if (!isFlipped && !isMatched) {
            handleClick(card);
        }
    };

    return (
        <div
            className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={handleCardClick}
        >
            <div className="card-inner">
                <div className="card-front">
                    {/* Показываем рубашку карточки */}
                </div>
                <div className="card-back">
                    {/* Показываем картинку или число на лицевой стороне карточки */}
                    {card.content}
                </div>
            </div>
        </div>
    );
};

export default Card;