var hy = hy || {};
hy.html = hy.html || {};
hy.html.TextBox = hy.extend(hy.Object);
hy.html.TextBox.prototype.init = function(config){
    this.superCall("init",[config]);
    this._inputNode = null;
    this._inputNodeVisible = true;
    this._htmlTextBoxContainer = document.createElement("div");
    this._htmlTextBoxContainer.style.position = "absolute";
    this._htmlTextBoxContainer.style.margin = "0px";
    this._htmlTextBoxContainer.style.padding = "0px";
    this._htmlTextBoxContainer.style.borderWidth = "0px";
    this._htmlTextBoxContainer.style.borderStyle = "solid";
    this._htmlTextBoxContainer.style.outline = "none";
    this._htmlTextBoxContainer.style.zIndex = "999";
    this._htmlTextBoxContainer.style.display = "none";
    this._htmlTextBoxContainer.style.overflow = "hidden";

    this._htmlTextBox = document.createElement("div");
    this._htmlTextBox.setAttribute("contenteditable","true");
    this._htmlTextBox.style.margin = "0px";
    this._htmlTextBox.style.padding = "0px";
    this._htmlTextBox.style.outline = "none";
    this._htmlTextBox.style.background = "transparent";
    this._htmlTextBox.style.whiteSpace = "pre-wrap";
    this._htmlTextBox.style.border = "none";
    this._htmlTextBox.style.display = "table-cell";
    if(hy.platform.isMobile()){
        hy.event.addEventListener(this._htmlTextBox,this,"touchstart",function(e){
            e = event ? event : e;
            try{
                e.stopPropagation();
            }catch (err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,this,"touchmove",function(e){
            e = event ? event : e;
            try{
                e.stopPropagation();
            }catch (err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,this,"touchend",function(e){
            e = event ? event : e;
            try{
                e.stopPropagation();
            }catch (err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,this,"touchcancel",function(e){
            e = event ? event : e;
            try{
                e.stopPropagation();
            }catch (err){
                e.cancelBubble = true;
            }
        });
    }else{
        hy.event.addEventListener(this._htmlTextBox,"keydown",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"keypress",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"keyup",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"click",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"dblclick",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"mousedown",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"mousemove",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"mouseup",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"mousewheel",this,function(e){
            var e = event ? event : e;
            try{
                var height = hy.dom.parsePxStrToInt(this._htmlTextBoxContainer.style.height);
                var wheelDelta = e.wheelDelta ? e.wheelDelta : e.detail;
                if(wheelDelta > 0){
                    if(this._htmlTextBoxContainer.scrollTop > 0){
                        this._htmlTextBoxContainer.scrollTop -= (this._htmlTextBoxContainer.scrollTop > 20) ? 20 : this._htmlTextBoxContainer.scrollTop;
                    }
                }else{
                    if(this._htmlTextBoxContainer.scrollTop +  height < this._htmlTextBoxContainer.scrollHeight){
                        var deltaTop = this._htmlTextBoxContainer.scrollHeight - height;
                        this._htmlTextBoxContainer.scrollTop += (deltaTop > 20) ? 20 : deltaTop;
                    }
                }
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"DOMMouseScroll",this,function(e){
            var e = event ? event : e;
            try{
                var height = hy.dom.parsePxStrToInt(this._htmlTextBoxContainer.style.height);
                var wheelDelta = e.wheelDelta ? e.wheelDelta : e.detail;
                if(wheelDelta > 0){
                    if(this._htmlTextBoxContainer.scrollTop > 0){
                        this._htmlTextBoxContainer.scrollTop -= (this._htmlTextBoxContainer.scrollTop > 20) ? 20 : this._htmlTextBoxContainer.scrollTop;
                    }
                }else{
                    if(this._htmlTextBoxContainer.scrollTop +  height < this._htmlTextBoxContainer.scrollHeight){
                        var deltaTop = this._htmlTextBoxContainer.scrollHeight - height;
                        this._htmlTextBoxContainer.scrollTop += (deltaTop > 20) ? 20 : deltaTop;
                    }
                }
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"contextmenu",this,function(e){
            var e = event ? event : e;
            try{
                e.stopPropagation();
            }catch(err){
                e.cancelBubble = true;
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"focus",this,function(e){
            if(this._inputNode != null){
                this._inputNode.focus(null);
            }
        });
        hy.event.addEventListener(this._htmlTextBox,"blur",this,function(e){
            if(this._inputNode != null){
                this._inputNode.blur();
            }
        });
    }
    this._htmlTextBoxContainer.appendChild(this._htmlTextBox);
    document.body.appendChild(this._htmlTextBoxContainer);
}
hy.html.TextBox.prototype.setValue = function(value){
    this._htmlTextBox.innerText = value;
}
hy.html.TextBox.prototype.getValue = function(){
    return this._htmlTextBox.innerText;
}
hy.html.TextBox.prototype.getInputNode = function(){
    return this._inputNode;
}
hy.html.TextBox.prototype.showForNode = function(node){
    if(node && this._inputNode != node){
        var width = node.getWidth() - node.getTextPaddingLeft() - node.getTextPaddingRight()-2*node.getBorderWidth();
        var height = node.getHeight() - node.getTextPaddingTop() - node.getTextPaddingBottom()-2*node.getBorderWidth();
        if(width > 0 && height > 0){
            this.blurForNode();
            var absPoint = node.transPointToAncestorNode({x:node.getAnchorPixelX(),y:node.getAnchorPixelY()},null);
            /*位置*/
            this._htmlTextBoxContainer.style.top = absPoint.y + "px";
            this._htmlTextBoxContainer.style.left = absPoint.x + "px";
            this._htmlTextBoxContainer.style.width = width + "px";
            this._htmlTextBoxContainer.style.height = height + "px";
            this._htmlTextBoxContainer.scrollTop = "0px";
            this._htmlTextBox.style.width = width + "px";
            this._htmlTextBox.style.maxWidth = width + "px";
            this._htmlTextBox.style.height = height + "px";
            /*背景*/
            if(node.getPaintInheritValue("backgroundColor")){
                this._htmlTextBoxContainer.style.backgroundColor = node.getPaintInheritValue("backgroundColor");
            }else{
                this._htmlTextBoxContainer.style.background = "transparent";
            }
            /*内边距边框*/
            if(node.getBorderColor() && node.getBorderWidth() > 0){
                this._htmlTextBoxContainer.style.borderColor = node.getBorderColor();
                this._htmlTextBoxContainer.style.borderWidth = node.getBorderWidth() + "px";
                this._htmlTextBoxContainer.style.paddingLeft = node.getTextPaddingLeft() + "px";
                this._htmlTextBoxContainer.style.paddingRight = node.getTextPaddingRight() + "px" ;
                this._htmlTextBoxContainer.style.paddingTop = node.getTextPaddingTop() + "px";
                this._htmlTextBoxContainer.style.paddingBottom = node.getTextPaddingBottom() + "px";
            }else{
                this._htmlTextBoxContainer.style.borderColor = "transparent";
                this._htmlTextBoxContainer.style.borderWidth = "0px";
                this._htmlTextBoxContainer.style.paddingLeft = node.getTextPaddingLeft() + "px";
                this._htmlTextBoxContainer.style.paddingRight = node.getTextPaddingRight() + "px";
                this._htmlTextBoxContainer.style.paddingTop = node.getTextPaddingTop() + "px";
                this._htmlTextBoxContainer.style.paddingBottom = node.getTextPaddingBottom() + "px";
            }
            /*圆角*/
            if(node.getCornorRadius() > 0){
                this._htmlTextBoxContainer.style.borderRadius = node.getCornorRadius() + "px";
            }else{
                this._htmlTextBoxContainer.style.borderRadius = "0px";
            }
            /*字体*/
            this._htmlTextBox.style.font = node.getTextFont();
            this._htmlTextBox.style.lineHeight = node.getTextLineHeight() + "px";
            this._htmlTextBox.style.color = node.getTextColor();
            /*文字对齐选项*/
            switch (node.getTextHorAlign()){
                case hy.gui.TEXT_HORALIGN_LEFT:{
                    this._htmlTextBox.style.textAlign = "left";
                    break;
                }
                case hy.gui.TEXT_HORALIGN_RIGHT:{
                    this._htmlTextBox.style.textAlign = "right";
                    break;
                }
                default :{
                    this._htmlTextBox.style.textAlign = "center";
                    break;
                }
            }
            switch (node.getTextVerAlign()){
                case hy.gui.TEXT_VERALIGN_TOP:{
                    this._htmlTextBox.style.verticalAlign = "top";
                    break;
                }
                case hy.gui.TEXT_VERALIGN_BOTTOM:{
                    this._htmlTextBox.style.verticalAlign = "bottom";
                    break;
                }
                default :{
                    this._htmlTextBox.style.verticalAlign = "middle";
                    break;
                }
            }
            this._htmlTextBox.innerText = node.getText();
            this._htmlTextBoxContainer.style.display = "inline";
            this._inputNode = node;
            this._inputNodeVisible = node.getVisible();
            node.setVisible(false);
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
hy.html.TextBox.prototype.hideForNode = function(node){
    if(this._inputNode && this._inputNode == node){
        this._inputNode.setText(this._htmlTextBox.innerText);
        this._inputNode.blur();
        this._inputNode.setVisible(this._inputNodeVisible);
        this._inputNode = null;
        this._htmlTextBoxContainer.style.display = "none";
        return true;
    }else{
        return false;
    }
}
hy.html.TextBox.prototype.focusForNode = function(node){
    if(this.showForNode(node)){
        this._htmlTextBox.focus();
        return true;
    }else{
        return false;
    }
}
hy.html.TextBox.prototype.blurForNode = function(node){
    if(this.hideForNode(node)){
        this._htmlTextBox.blur();
        return true;
    }else{
        return false;
    }
}
