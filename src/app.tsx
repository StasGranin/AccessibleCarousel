import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';

import Carousel, {CustomDotsComponentProps, SwipeEvent} from './Carousel';
import './app.scss';

type CarouselItemProps = {
	onActionHandler?: (fn: (any) => void) => void;
	onFocusHandler?: (fn: (any) => void) => void;
	itemNumber: number
};

const CarouselItem: React.FC<CarouselItemProps> = ({itemNumber, onActionHandler, onFocusHandler}) => {
	const onClick = () => {
		console.log(`Clicked item no. ${itemNumber}`);
	};

	const onFocus = () => {
		console.log(`Focused item no. ${itemNumber}`);
	};

	useEffect(() => {
		onActionHandler(onClick);
		onFocusHandler(onFocus);
	}, []);

	return (
		<div className="carouselTestItem" onClick={onClick} tabIndex={-1}>
			<div className="text">Carousel slide {itemNumber}</div>
			<img src={`https://picsum.photos/200?t=${new Date().getTime()}`} alt="random image"/>
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
					{slides.map((item, index) => <CarouselItem key={item} itemNumber={1} />)}
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