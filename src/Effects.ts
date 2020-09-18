import { EventHandler } from './EventHandling';
import { JQueryElementAccepted } from './JQuery';
import TypeGuards from './TypeGuards';

export type AnimationObject = { [propert: string]: string };

enum AnimationsManipulations {
	Play = 'play',
	Pause = 'pause',
	Reverse = 'reverse',
	Finish = 'finish',
	Cancel = 'cancel',
}

class Effects {
	private animations: Animation[][] = [];

	private getDefaultDisplayValue(element: Element) {
		const createdElement = document.createElement(element.nodeName);
		document.body.append(createdElement);
		const defaultValue = getComputedStyle(createdElement).display;

		return defaultValue;
	}

	private getInitialProperties(element: Element, animation: AnimationObject) {
		const computedStyle = getComputedStyle(element);

		const initialProperties = Object.entries(animation).map(([property]) => [
			property,
			computedStyle.getPropertyValue(property),
		]);

		return Object.fromEntries(initialProperties);
	}

	private mergeAnimations(animations: (Animation | undefined)[]) {
		animations.forEach((animation, index) => {
			if (!this.animations[index]) this.animations[index] = [];
			if (!animation) return;

			this.animations[index].push(animation);
		});
	}

	animate(
		elements: JQueryElementAccepted[],
		animation: AnimationObject,
		duration: number,
		callback?: EventHandler
	) {
		const animations = elements.map((element, i) => {
			if (TypeGuards.isWindow(element) || TypeGuards.isDocument(element)) return;

			const anim = element.animate(
				[this.getInitialProperties(element, animation), animation],
				{
					duration,
					fill: 'both',
				}
			);

			anim.onfinish = (e) => {
				const animationToRemoveIndex =
					this.animations[i]?.findIndex((a) => a === anim) ?? -1;
				if (animationToRemoveIndex !== -1) {
					this.animations[i].splice(animationToRemoveIndex, 1);
				}

				if (callback) {
					callback.call(element, element, i, e);
				}
			};

			return anim;
		});

		this.mergeAnimations(animations);
	}

	private manipulateAnimations(manipulation: AnimationsManipulations) {
		this.animations.forEach((group) => {
			group.forEach((animation) => animation[manipulation]());
		});
	}

	play() {
		this.manipulateAnimations(AnimationsManipulations.Play);
	}

	pause() {
		this.manipulateAnimations(AnimationsManipulations.Pause);
	}

	reverse() {
		this.manipulateAnimations(AnimationsManipulations.Reverse);
	}

	finish() {
		this.manipulateAnimations(AnimationsManipulations.Finish);
	}

	cancel() {
		this.manipulateAnimations(AnimationsManipulations.Cancel);
	}
}

export default Effects;
