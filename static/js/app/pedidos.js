define(["jquery", 'app/urlmanager', 'showutils', 'app/templates', 'app/auth'], function($, urlManager, showutils, templates, auth) {

    'use strict';

    var containerId = "#pedidos-container",
        template = null,
        comListTemplate = null,
        pedidoTextarea = null,
        comListContainer = null


    // Init interface
    function init() {
        // comListTemplate = templates.get("comments-list", true)
        template = templates.get("pedido")
        $(containerId).html(template({}))
        pedidoTextarea = $("#pedido-textarea"),
        // comListContainer = $("#comments-list-container"),

        // Send new pedido
        $("#pedido-send-button").click(function(e) {
            // TODO: verificar se está logado
            auth.validateMicroTokenTime(sendPedido)
            return false
        })
    }


    // Add comment to a thread
    function sendPedido() {
        var url = ESIC_API_URL + "/pedidos/new"
        var data = {
            'token': localStorage.microToken,
            'orgao': orgaoSelector.val(),
            'text': pedidoTextarea.val(),
            // 'keywords': urlManager.getParam('code'),
            'keywords': [urlManager.getParam('protocolo')],
        }
        $.ajax({
            url        : url,
            dataType   : 'json',
            contentType: 'application/json; charset=UTF-8',
            data       : JSON.stringify(data),
            type       : 'POST',
        })
        .done(function(data) {
            pedidoTextarea.val("")
            // comListContainer.html(comListTemplate(data))
        })
        .fail(function(data, error, errorName) {
            console.log(data)
            alert(data.responseJSON.message)
        })
    }


    // // Update comments list
    // function update(event, data) {
    //     if (!comTemplate) initComments()

    //     console.log("UPADETE-COMENTS", event, data, urlManager.getParam('code'))
    //     var code = typeof data !== 'undefined' ? data.value : urlManager.getParam('code')
    //     $.getJSON(
    //         COMMENTS_API_URL + '/thread/' + code
    //     )
    //     .done(function(data) {
    //         comListContainer.html(comListTemplate(data))
    //     })
    // }

    init()
    // showutils.showSubscribe("protocolo.changed", containerId, true, update)






    var loaded = false,
        elementId = "#orgao-selector",
        orgaoSelector = $(elementId)

    function initOrgaoSelector() {
        // Populate selector and prepare its publisher
        $.getJSON(window.ESIC_API_URL + '/orgaos')
            .done(function(response_data) {
                var existingOrgaos = response_data.orgaos
                for (var i = 0; i < existingOrgaos.length; ++i) {
                    var orgao = existingOrgaos[i];
                    var item = '<option value="' + orgao + '">' + orgao + '</option>';
                    orgaoSelector.append(item)
                }

                // // -----------SUPER STYLED SELECT-----------------------------------------
                // // Iterate over each select element
                // $('#orgao-selector').each(function() {
                //     var orgaoSelector = new SuperSelect($(this));

                //     // // Subscribe to orgao change
                //     // pubsub.subscribe("orgao.changed", function(event, data) {
                //     //     orgaoSelector.setValue(data.value);
                //     // });

                //     orgaoSelector.on('change', function(e, value) {
                //         pubsub.publish('orgao.changed', {
                //             value: [value]
                //         });
                //         /* alert($this.val()); Uncomment this for demonstration! */
                //     });

                // });
                // // -----------------------------------------------------------------------


                // // Subscribe to orgao change
                // pubsub.subscribe("orgao.changed", function(event, data) {
                //     orgaoSelector.val(data.value)
                // })

                // // Set current orgao
                // var currentYear = urlManager.getParam('orgao')
                // // if (!currentYear) currentYear = new Date().getFullYear()
                // orgaoSelector.val(currentYear)
            })

        // // Publish orgao change
        // orgaoSelector.change(function(e) {
        //     pubsub.publish('orgao.changed', {value: e.target.value})
        // })
    }

    initOrgaoSelector()

    // Run loader on first show
    showutils.runOnFirstShow(elementId, function () {
        if (!loaded) {
            loaded = true
            initOrgaoSelector()
        }
    })
})
