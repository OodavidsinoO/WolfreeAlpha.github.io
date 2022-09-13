// SPDX-License-Identifier: AGPL-3.0-or-later
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
'use strict'
const wolfree = {
	input:    new URLSearchParams(location.search).get`wolfree_input`    || '',
	i2d:      new URLSearchParams(location.search).get`wolfree_i2d`      || '',
	podstate: new URLSearchParams(location.search).get`wolfree_podstate` || '',
	makeObservable: t => {
		if (t.startWebSocket) {
			const startWebSocket = t.startWebSocket
			t.startWebSocket = e => {
				startWebSocket(e)
				if (t.current.value.length) {
					wolfree.input = t.current.value
					wolfree.i2d   = t.current.i2d ? 'true' : ''
				}
				setTimeout(wolfree.entrypoint)
			}
		}
	},
	entrypoint: async () => {
		setTimeout(
			() => {
				const windowURL = new URL(location)
				windowURL.searchParams.set('wolfree_input',    wolfree.input)
				windowURL.searchParams.set('wolfree_i2d',      wolfree.i2d)
				windowURL.searchParams.set('wolfree_podstate', wolfree.podstate)
				history.pushState(null, '', windowURL)
			}
		)
		setTimeout( // show the skeleton components
			() => document.querySelector`
				#__next > div > div._1MeJ._3eup > main > div._3BQG > div,
				#__next > div > div._1MeJ._3eup > main > div._1wzL > div,
				#__next > div > div._1MeJ._3eup > main > div._3VFW > div
			`.style.display = ''
		)
		setTimeout( // hide the results of previous calculations
			() => {
				const element = document.querySelector`[data-wolfree-pods]`
				if (element) element.style.display = 'none'
			}
		)
		const appIDArray = [
			'26LQEH-YT3P6T3YY9',
			'K49A6Y-4REWHGRWW6',
			'J77PG9-UY8A3WQ2PG',
			'P3WLYY-2G9GA6RQGE',
			'P7JH3K-27RHWR53JQ',
			'L349HV-29P5JV8Y7J',
			'77PP56-XLQK5GKUAA',
			'59EQ3X-HE26TY2W64',
			'8Q68TL-QA8W9GEXAA',
			'KQRKKJ-8WHPY395HA',
			'AAT4HU-Q3RETTGY93',
			'7JKH84-T648HW2UV9',
			'WYEQU3-2T55JP3WUG',
			'T2XT8W-57PJW3L433',
			'2557YT-52JEY65G9K',
			'UVPKUJ-X9Q365R7E3',
			'W85VHP-E6WH3U78EE',
			'W33433-AKRV98E5AT',
			'3A3P8J-XA4UTGKAH5',
			'QGK5UA-HGUK7AP5LY',
			'8EL8GA-7W6EVYTQ5X',
			'W4TUXQ-GA2H8KUULA',
			'UGHH75-YPX2RVU4E4',
			'RP4497-R9XPK236YY',
			'2G2G2W-LY3XQUU5R3',
			'V5LXE2-5AXE4LPAX4',
			'H8JUT7-5UP9YWH8G6',
			'E88K2A-3652G9E57K',
			'893Q95-3PJW2QP6AY',
			'AAL48A-2X7Q4K59GU',
		]
		const appID = appIDArray[
			self.crypto.getRandomValues(new Uint32Array(1)) % appIDArray.length
		]
		const apiURL = new URL('https://api.wolframalpha.com/v2/query')
		apiURL.searchParams.append('output', 'json')
		apiURL.searchParams.append('scantimeout', 30)
		apiURL.searchParams.append('podtimeout', 30)
		apiURL.searchParams.append('formattimeout', 30)
		apiURL.searchParams.append('parsetimeout', 30)
		apiURL.searchParams.append('totaltimeout', 30)
		apiURL.searchParams.append('podstate', 'Step-by-step solution')
		apiURL.searchParams.append('podstate', 'Step-by-step')
		apiURL.searchParams.append('podstate', 'Show all steps')
		wolfree.input    && apiURL.searchParams.append('appid', appID)
		wolfree.input    && apiURL.searchParams.append('input', wolfree.input)
		wolfree.i2d      && apiURL.searchParams.append('i2d', wolfree.i2d)
		wolfree.podstate && apiURL.searchParams.append('podstate', wolfree.podstate)
		await jQuery.ajax(
			{
				url: apiURL,
				dataType: 'jsonp',
				success: response => document.querySelector`main`.insertAdjacentHTML(
					'afterend',
					`
						<div
							class=_3BQG
							style=padding:0
							data-wolfree-pods
						>
							<div class=_2ThP>
								<div class=_pA1m>
									<section class=_1vuO>
										${
											response.queryresult.pods?.map(
												pod => `
													<section class=_gtUC>
														${
															`
																<header class=_2Qm3>
																	<h2 class=_3OwK>
																		${pod.title}
																	</h2>
																	${
																		pod.states?.map(
																			state => state.states ? `
																				<select
																					style="
																						background: white;
																						border-radius: 4px;
																						color: orangered;
																						border: thin solid darkorange
																					"
																					onchange="
																						wolfree.podstate = this.value
																						setTimeout(wolfree.entrypoint)
																					"
																				>
																					<option>
																						${state.value}
																					</option>
																					${
																						state.states.map(
																							state => `
																								<option>
																									${state.name}
																								</option>
																							`
																						).join``
																					}
																				</select>
																			` : ''
																		).join('') || ''
																	}
																</header>
																<div class=_1brB> </div>
																${
																	pod.subpods.map(
																		subpod => `
																			<div class=_1brB>
																				<div class=_3fR4>
																					<img
																						class=_3c8e
																						style=width:auto
																						src=${subpod.img.src}
																					>
																				</div>
																			</div>
																			<div
																				class=_1brB
																				style="
																					font-family: monospace;
																					overflow: auto;
																				"
																			>
																				<div class=_3fR4>
																					<details>
																						<summary style=direction:rtl> </summary>
																						<div contenteditable>
																							<pre>${subpod.plaintext}</pre>
																						</div>
																						<br>
																					</details>
																				</div>
																			</div>
																		`
																	).join``
																}
															`
														}
													</section>
												`
											).join('') || ''
										}
										<section class=_gtUC>
											<header class=_2Qm3>
												<h2 class=_3OwK>
													Wolfree JavaScript variables
												</h2>
											</header>
											<div
												class=_1brB
												style="
													font-family: monospace;
													overflow: auto;
												"
											>
												<div class=_3fR4>
													<details open>
														<summary> </summary>
														<br>
														<div contenteditable>
															<pre>${JSON.stringify({wolfree, response}, null, 4)}</pre>
														</div>
														<br>
													</details>
												</div>
											</div>
										</section>
									</section>
								</div>
							</div>
						</div>
					`
				),
			}
		)
		setTimeout( // hide the skeleton components
			() => document.querySelector`
				#__next > div > div._1MeJ._3eup > main > div._3BQG > div,
				#__next > div > div._1MeJ._3eup > main > div._1wzL > div,
				#__next > div > div._1MeJ._3eup > main > div._3VFW > div
			`.style.display = 'none'
		)
	},
}
setInterval(
	() => {
		setTimeout( // insert the wolfree logo
			() => document.querySelector`[data-wolfree-logo]` || document.querySelector`body`.insertAdjacentHTML(
				'afterbegin',
				`
					<nav
						style="
								
								text-align: center;
								font-family: sans-serif;
								line-height: 3;
						"
						data-wolfree-logo
					>
						<a
							style="
								font-size: xx-large;
								text-decoration: none;
							"
							href=../index.html
						>
							WolfreeAlpha
						</a>
					</nav>
				`
			)
		)
		const hide = selector => setTimeout(
			() => {
				const element = document.querySelector(selector)
				if (element) element.style.display = 'none'
			}
		)
		hide`#__next > div > footer` // <a href="/pro">Pro</a>
		hide`#__next > div > header` // <span>UPGRADE TO PRO</span>
		hide`
			#__next > div > div._1MeJ._3eup > main > div._2UIf > a > img,
			#__next > div > div._1MeJ._3eup > main > div._3Cg6 > a > img
		` // <img alt="WolframAlpha computational knowledge AI">
		hide`
			#__next > div > div._1MeJ._3eup > main > div._2UIf > div._P0Rq > ul > li:nth-child(2) > div,
			#__next > div > div._1MeJ._3eup > main > div._3Cg6 > div._Lhw0 > ul > li:nth-child(2) > div
		` // <span>Use Math Input Mode to directly enter textbook math notation. </span>
		hide`
			#__next > div > div._1MeJ._3eup > main > div._2UIf > div._3-sN > div > div,
			#__next > div > div._1MeJ._3eup > main > div._3Cg6 > div._3-sN > div > div
		` // <span>Enter an image as an input to Wolfram|Alpha for analysis or processing.</span>
		hide`
			#__next > div > div._1MeJ._3eup > main > div._3BQG > div > div._2bfa,
			#__next > div > div._1MeJ._3eup > main > div._1wzL > div > div._2bfa,
			#__next > div > div._1MeJ._3eup > main > div._3VFW > div > div._3Fov
		` // <span>Have a question about using Wolfram|Alpha?</span>
	},
	100
)
window.addEventListener(
	'load',
	async () => { // focus on the orangish input box
		while (document.activeElement != document.querySelector`input`) {
			document.querySelector`input`.focus()
			await new Promise(resolve => setTimeout(resolve, 1000))
		}
	}
)
