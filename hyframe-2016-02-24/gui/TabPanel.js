HY.GUI.TabPanel = function(config){
    this.init(config);
}
HY.GUI.TabPanel.prototype = new HY.GUI.View();
HY.GUI.TabPanel.prototype.initMember = function(config){
    this.superCall("initMember",[config]);
    if(config.panels != null){ this._panels = config.panels; } else { this._panels = null; }
    this._selectedPanel = null;
}
HY.GUI.TabPanel.prototype.initConstraint = function(){
    this.superCall("initConstraint");
    if(this._panels != null && this._panels.length > 0){
        for(var i = this._panels.length-1;i>=0;--i){
            var panel = this._panels[i];
            panel.setHeaderConstraint(false);
            panel.getHeaderView().addEventListener('mousedown',this._headerViewMouseDown,this);
            panel.getHeaderView().setBackgroundColor('#eeeeee');
            panel.getTitleLabel().setTextColor("#000000");
            panel.getViewPort().setVisible(false);
            this.addChildNodeAtLayer(panel,0);
        }
        this.setSelectedPanel(this._panels[0]);
    }
}
HY.GUI.TabPanel.prototype.getPanels = function(){
    return this._panels;
}
HY.GUI.TabPanel.prototype.setPanels = function(pPanels){
    this._selectedPanel = null;
    if(this._panels != null){
        for(var i = this._panels.length-1;i>=0;--i){
            this.removeChildNodeAtLayer(this._panels[i],0);
        }
    }
    this._panels = pPanels;
    if(this._panels != null && this._panels.length > 0){
        for(var i = this._panels.length-1;i>=0;--i){
            var panel = this._panels[i];
            panel.setHeaderConstraint(false);
            panel.getHeaderView().addEventListener("mousedown",this._headerViewMouseDown,this);
            panel.getViewPort().setVisible(false);
            this.addChildNodeAtLayer(panel,0);
        }
        this.setSelectedPanel(this._panels[0]);
        this.needLayoutSubNodes();
    }
}
HY.GUI.TabPanel.prototype.getSelectedPanel = function(){
    return this._selectedPanel;
}
HY.GUI.TabPanel.prototype.setSelectedPanel = function (pPanel) {
    if(this._selectedPanel != null){
        this._selectedPanel.getViewPort().setVisible(false);
        this._selectedPanel.getHeaderView().setBackgroundColor("#eeeeee");
        this._selectedPanel.getTitleLabel().setTextColor("#000000");
    }
    this._selectedPanel = pPanel;
    if(this._selectedPanel){
        this._selectedPanel.getViewPort().setVisible(true);
        this._selectedPanel.getHeaderView().setBackgroundColor("#5bc0de");
        this._selectedPanel.getTitleLabel().setTextColor("#ffffff");
    }
}
HY.GUI.TabPanel.prototype.layoutSubNodes = function(){
    this.superCall("layoutSubNodes");
    if(this._panels != null && this._panels.length > 0){
        var startx = 0;
        var len = this._panels.length;
        var spacex = (this.getWidth()+2)/len;
        for(var i=0;i<len;++i){
            var panel = this._panels[i];
            panel.setX(0);
            panel.setY(0);
            panel.setWidth(this.getWidth());
            panel.setHeight(this.getHeight());
            panel.getHeaderView().setX(startx);
            panel.getHeaderView().setWidth(spacex-2);
            startx+=spacex;
        }
    }
}
HY.GUI.TabPanel.prototype._headerViewMouseDown = function(){
    this.needLayoutSubNodes();
}