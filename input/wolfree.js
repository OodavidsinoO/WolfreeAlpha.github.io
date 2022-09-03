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
				setTimeout(wolfree.updateDOM)
				setTimeout(wolfree.updateURL)
			}
		}
	},
	updateURL: () => {
		const windowURL = new URL(location)
		windowURL.searchParams.set('wolfree_input',    wolfree.input)
		windowURL.searchParams.set('wolfree_i2d',      wolfree.i2d)
		windowURL.searchParams.set('wolfree_podstate', wolfree.podstate)
		history.pushState(null, '', windowURL)
	},
	updateDOM: async () => {
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
		const corsURLArray = [
			'https://072c5402-f7ff-47b0-b84d-12bc32fddc9b.cyclic.app/',
			'https://c0d679b8-1b5f-4cb4-8fd7-925eaed04c0a.cyclic.app/',
			'https://99419715-93d7-4571-965d-ebf2bd1f4a53.cyclic.app/',
			'https://c0823ed3-1c21-4724-a5df-86c4fb1b8a03.cyclic.app/',
			'https://006ff44a-44ac-43cb-add2-50ebd29ed62e.cyclic.app/',
			'https://46bfded1-1f2a-4dea-8355-5eb6365681cf.cyclic.app/',
		]
		const newUint32Array1 = new Uint32Array(1)
		self.crypto.getRandomValues(newUint32Array1)
		const appID = appIDArray[newUint32Array1 % appIDArray.length]
		self.crypto.getRandomValues(newUint32Array1)
		const corsURL = corsURLArray[newUint32Array1 % corsURLArray.length]
		const apiURL = new URL('api.wolframalpha.com/v2/query', corsURL)
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
		const queryresult = (await (await fetch(apiURL)).json()).queryresult
		document.querySelector`main`.insertAdjacentHTML(
			'afterend', `
				<div
					class=_3BQG
					style=padding:0
					data-wolfree-pods
				>
					<div class=_2ThP>
						<div class=_pA1m>
							<section class=_1vuO>
								${
									queryresult.pods ? queryresult.pods.map(
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
																				wolfree.updateDOM()
																				wolfree.updateURL()
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
																	<div
																		class=_1brB
																		style="
																			font-family: monospace;
																			overflow: auto;
																		"
																	>
																		<div class=_3fR4>
																			<img
																				class=_3c8e
																				style=width:auto
																				src=${subpod.img.src}
																			>
																			<details>
																				<summary style=direction:rtl> </summary>
																				<div contenteditable>
																					<pre style=width:0>${subpod.plaintext}</pre>
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
									).join`` : ''
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
													<pre style=width:0>${JSON.stringify({wolfree, queryresult}, null, 4)}</pre>
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
