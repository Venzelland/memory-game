import React, { useState, useEffect } from 'react';
import Card from './Card';
import flipSound from './sounds/flip.mp3';
import matchSound from './sounds/match.mp3';
import winSound from './sounds/win.mp3';

const generateCards = (difficulty) => {
    const easyContents = ['A', 'B', 'C', 'D'];
    const mediumContents = ['A', 'B', 'C', 'D', 'E', 'F'];
    const hardContents = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const contents = difficulty === 'easy' ? easyContents
        : difficulty === 'medium' ? mediumContents
            : hardContents;
    const cards = contents.concat(contents)
        .sort(() => Math.random() - 0.5)
        .map((content, index) => ({
            id: index,
            content,
            isFlipped: false,
            isMatched: false,
        }));
    return cards;
};

const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
};

const Board = () => {
    const [difficulty, setDifficulty] = useState('medium'); // Default difficulty
    const [cards, setCards] = useState(generateCards(difficulty));
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        if (startTime && matchedPairs < cards.length / 2) {
            const id = setInterval(() => {
                setElapsedTime((Date.now() - startTime) / 1000);
            }, 1000);
            setIntervalId(id);
        }
        return () => clearInterval(intervalId);
    }, [startTime, matchedPairs]);

    const handleCardClick = (card) => {
        if (!startTime) {
            setStartTime(Date.now());
        }
        if (flippedCards.length < 2 && !card.isFlipped && !card.isMatched) {
            playSound(flipSound);
            setFlippedCards([...flippedCards, card]);
            setCards(prevCards =>
                prevCards.map(c =>
                    c.id === card.id ? { ...c, isFlipped: true } : c
                )
            );
        }
    };

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [firstCard, secondCard] = flippedCards;
            if (firstCard.content === secondCard.content) {
                playSound(matchSound);
                setCards(prevCards =>
                    prevCards.map(c =>
                        c.id === firstCard.id || c.id === secondCard.id
                            ? { ...c, isMatched: true }
                            : c
                    )
                );
                setMatchedPairs(matchedPairs + 1);
            }
            setTimeout(() => {
                resetTurn();
            }, 500);
        }
    }, [flippedCards]);

    useEffect(() => {
        if (matchedPairs === cards.length / 2) {
            playSound(winSound);
            clearInterval(intervalId);
        }
    }, [matchedPairs, cards.length]);

    const resetTurn = () => {
        setFlippedCards([]);
        setCards(prevCards =>
            prevCards.map(c =>
                c.isMatched ? { ...c, isFlipped: true } : { ...c, isFlipped: false }
            )
        );
    };

    const changeDifficulty = (level) => {
        setDifficulty(level);
        restartGame(level);
    };

    const restartGame = (level) => {
        setCards(generateCards(level || difficulty));
        setFlippedCards([]);
        setMatchedPairs(0);
        setStartTime(null);
        setElapsedTime(0);
        clearInterval(intervalId);
    };

    return (
        <>
            <div className="game-info">
                <button onClick={() => changeDifficulty('easy')}>Easy</button>
                <button onClick={() => changeDifficulty('medium')}>Medium</button>
                <button onClick={() => changeDifficulty('hard')}>Hard</button>
                <button onClick={() => restartGame()}>Restart</button>
                <div>Time: {elapsedTime.toFixed(0)} seconds</div>
            </div>
            <div className="board">
                {cards.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        handleClick={handleCardClick}
                        isFlipped={card.isFlipped}
                        isMatched={card.isMatched}
                    />
                ))}
                {matchedPairs === cards.length / 2 && (
                    <div className="congratulations">
                        Поздравляем! Вы нашли все пары!<br/>
                        Ваше время: {elapsedTime.toFixed(0)} секунд
                    </div>
                )}
            </div>
        </>
    );
};

export default Board;
