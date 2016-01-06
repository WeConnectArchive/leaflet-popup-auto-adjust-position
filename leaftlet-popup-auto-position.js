/**
 * Created by sbrady on 29/12/2015.
 */
(function (L) {
    L.AutoPositionPopup = L.Popup.extend({

        initialize: function (options, source) {
            L.Popup.prototype.initialize.call(this, options, source);
            this.options.initalOffset = new L.Point(this.options.offset.x, this.options.offset.y);
        },

        _adjustPosition: function () {
            this.options.offset.y = this.options.initalOffset.y;
            this.options.offset.x = this.options.initalOffset.x;
            this._updatePosition();

            var map = this._map,
                containerHeight = this._container.offsetHeight,
                containerWidth = this._containerWidth,

                layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);

            if (this._animated) {
                layerPos._add(L.DomUtil.getPosition(this._container));
            }

            var containerPos = map.layerPointToContainerPoint(layerPos),
                padding = L.point(this.options.autoAdjustPositionPadding),
                paddingTL = L.point(this.options.autoAdjustPositionPaddingTopLeft || padding),
                paddingBR = L.point(this.options.autoAdjustPositionPaddingBottomRight || padding),
                size = map.getSize(),
                dx = 0,
                dy = 0;

            if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
                dx = containerPos.x + containerWidth - size.x + paddingBR.x;
            }
            if (containerPos.x - dx - paddingTL.x < 0) { // left
                dx = containerPos.x - paddingTL.x;
            }
            if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
                dy = containerPos.y + containerHeight - size.y + paddingBR.y;
            }
            if (containerPos.y - dy - paddingTL.y < 0) { // top
                dy = containerPos.y - paddingTL.y;
            }


            if (dy < 0) {
                this.options.offset.y = containerHeight;
            }
            else if (dy > 0) {
                this.options.offset.y = this.options.initalOffset.y;
            }

            if (dx < 0) {
                this.options.offset.x = containerWidth / 2;
            } else if (dx > 0) {
                this.options.offset.x = -containerWidth / 2;
            }
            this._updatePosition();
        },

        _adjustPan: function () {
            if (this.options.autoPan) {
                return L.Popup.prototype._adjustPan.call(this);
            }
            if (this.options.autoAdjustPosition) {
                return this._adjustPosition();
            }
        }

    });
}(window.L));