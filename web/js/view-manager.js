/**
 *  view-manager.js made by TotomInc <github.com/TotomInc>
 *  require html-imports polyfill for full cross-browser support <github.com/webcomponents/html-imports>
 *  and require jQuery (script made with jQuery v1.12.4)
 *  view-manager.js was made because no view system were adapted for this project.
 **/

var viewManager = {
    getHashView: function() {
        return window.location.hash.substr(1, window.location.hash.length);
    },
    
    onHashChange: function() {
        var name = this.getHashView();
        
        return this.loadView(name, true);
    },
    
    viewExists: function(name) {
        var el = document.querySelector('link[template="' + name + '"]');
        
        if (el === null)
            return false;
            
        if (typeof el === 'object')
            return true;
    },
    
    navbarMargin: function() {
        if ($('.nav-extender').hasClass('nav-extended'))
            $('.navbar-fixed').css('margin-bottom', '48px');
        else
            $('.navbar-fixed').css('margin-bottom', '0px');
    },
    
    changeNavbar: function(name) {
        var exist = this.viewExists(name),
            navType;
        
        if (exist)
            navType = document.querySelector('link[template="' + name + '"]').getAttribute('navbar');
        else if (!exist)
            navType = 'default';
        
        this.loadView(navType, false);
        return this.navbarMargin();
    },
    
    // dynamic should be used only for main-view container
    loadView: function(name, dynamic) {
        var exist = this.viewExists(name),
            el = (exist) ? document.querySelector('link[template="' + name + '"]') : document.querySelector('link[template="not-found"]'),
            container = (exist) ? el.getAttribute('container') : 'main-view';
        
        el = el.import;
        el = el.querySelector('body > div');
        
        return this.displayView(el, container, name, dynamic);
    },
    
    displayView: function(el, container, name, dynamic) {
        $('#' + container).empty().append(el.cloneNode(true));
        
        socket.emit('loading-' + name, myID);
        
        if (dynamic)
            this.changeNavbar(name);
    },
    
    init: function() {
        if (window.location.hash.length == 0)
            window.location.hash = "#accueil";
        
        var view = this.getHashView();
        
        this.loadView('navbar', false);
        this.loadView('footer', false);
        this.loadView(view, true);
        
        $(window).bind('hashchange', function() {
            viewManager.onHashChange();
        });
    }
};