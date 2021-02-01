import { writable } from 'svelte/store';

const createWritableStore = (key, startValue) => {
	const { subscribe, set } = writable(startValue);

	return {
		subscribe,
		set,
		useLocalStorage: () => {
			const json = localStorage.getItem(key);
			if (json) {
				set(JSON.parse(json));
			}

			subscribe(current => {
				localStorage.setItem(key, JSON.stringify(current));
			});
		}
	};
}

export const
	playerName = createWritableStore('playerName', ""),
	gamesIAmIn = createWritableStore('gamesIAmIn', {}), // it should be a dictionary so it can be accessed by key (game id)
	autojoin = writable(false);