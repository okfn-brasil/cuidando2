// Assets are converted on build to base64 strings, so in Browser they can
// be used as variables, reducing request number.
const assets = {
    logo: require('urljs?once=1!../assets/logo.svg'),
    lupa: require('urljs?once=1!../assets/lupa.svg'),
    planejado: require('urljs?once=1!../assets/map/planejado.svg'),
    empenhado: require('urljs?once=1!../assets/map/empenhado.svg'),
    liquidado: require('urljs?once=1!../assets/map/liquidado.svg'),
    aPla: require('urljs?once=1!../assets/activities/planejado.svg'),
    aEmp: require('urljs?once=1!../assets/activities/empenhado.svg'),
    aLiq: require('urljs?once=1!../assets/activities/liquidado.svg'),
    aCom: require('urljs?once=1!../assets/activities/comments.png'),
    aComExtra: require('urljs?once=1!../assets/activities/comments-extra.png'),
    aPer: require('urljs?once=1!../assets/activities/pergunta.png'),
    moedas: require('raw!../assets/moedas.svg'),
    patM: require('urljs?once=1!../assets/patM.png'),
    patNM: require('urljs?once=1!../assets/patNM.png'),
}

export default assets
