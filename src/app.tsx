import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';

import Carousel, {CustomDotsComponentProps, SwipeEvent} from './Carousel';
import './app.scss';

type CarouselItemProps = {
	onActionHook?: (fn: (any) => void) => void;
	onFocusHook?: (fn: (any) => void) => void;
	slideIndex?: number;
	someProp: number;
};

const CarouselItem: React.FC<CarouselItemProps> = ({someProp, slideIndex, onActionHook, onFocusHook}) => {
	const [joke, setJoke] = useState('');

	const onClick = () => {
		console.log(`Clicked item no. ${slideIndex}`);
	};

	const onFocus = () => {
		console.log(`Focused item no. ${slideIndex}`);
	};

	useEffect(() => {
		onActionHook(onClick);
		onFocusHook(onFocus);
		fetch('https://icanhazdadjoke.com/', {headers: {'Accept': 'text/plain'}}).then(response => response.text().then(text => setJoke(text)));
	}, []);

	return (
		<div className="carouselTestItem" onClick={onClick} tabIndex={-1}>
			<div className="slideNumber" aria-hidden={true}>{slideIndex+1}</div>
			<img src={`https://picsum.photos/200?t=${new Date().getTime()}`} alt="Some nice image, and;"/>
			<p className="text">{joke}</p>
		</div>
	)
};

const CustomDots: React.FC<CustomDotsComponentProps> = ({carouselSlides, focusedIndex, onAction}) => {
	return (<div className="customDots" onClick={() => onAction(focusedIndex+1, 'Dots')}>Press here to focus next item ({focusedIndex+1})</div>)
}

const CarouselWrapper: React.FC = () => {
	const [itemsCount, setItemsCount] = useState(10);
	const slides = new Array(itemsCount).fill(new Date().getTime(), 0, itemsCount);

	return (
		<div>
			<button onClick={() => setItemsCount(Math.max(itemsCount - 1, 0))}>Remove Slides</button>
			<div className="carouselContainer">
				<Carousel
					aria-label="My awesome carousel"
					slidesToScroll={3}
					focusOnScroll={true}
					onSlideFocus={onCarouselEvent.bind(null, 'onSlideFocus')}
					onSwipe={onCarouselEvent.bind(null, 'onSwipe')}
					showArrows={true}
					showDots={true}
					/*dots={CustomDots}*/
					prevArrow={<div className="carouselArrow"/>}
					nextArrow={<div className="carouselArrow"/>}>
					{slides.map((item, index) => <CarouselItem key={item} someProp={index} />)}
				</Carousel>
			</div>
			<button onClick={() => setItemsCount(itemsCount + 1)}>Add Slides</button>
		</div>);
};

const onCarouselEvent = (eventType: string, event: FocusEvent|SwipeEvent) => {
	console.log(eventType, event);
}

const App = (
	<div>
		<CarouselWrapper />
	</div>
);

render(
	App, document.getElementById('app')
);