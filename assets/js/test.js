var defaultOptions = {
    cashbackType: 1,
    couponType: 2
};
var CashbackCouponSet = function($container, options) {
    this.MIN = 5;
    this.$container = $container;
    this.options = $.extend({}, defaultOptions, options);
    this._init();
};
CashbackCouponSet.prototype = {
    _init: function() {
        this._createCashbackCoupon();
    },
    _createCashbackCoupon: function() {
        var setObj = this._getCashbackCouponObj();
        var $items = $('<div class="am-g"></div>'),
            $item,
            $contentContainer,
            $operateContainer;
        this.$container.html('');
        for (var i = 0, len = setObj.length; i < len; i++) {
            $item = $('<div class="am-g"></div>');
            $contentContainer = $('<div class="am-u-md-11"></div>');
            $operateContainer = $('<div class="am-u-md-1"></div>');
            $contentContainer.html(this._createCashbackCouponItem(i));
            if (i === len - 1) {
                $operateContainer.html($('<a href="javascript:void(0)" class="cbco-plus iconfont">+</a>'));
            } else {
                $operateContainer.html($('<a href="javascript:void(0)" class="cbco-reduce iconfont">-</a>'));
            }
            (function(index, self) {
                $('.cbco-plus', $operateContainer).on('click', function() {
                    self._addCashbackCouponItem();
                });
                $('.cbco-reduce', $operateContainer).on('click', function() {
                    self._removeCashbackCouponItem(index);
                });
            })(i, this)
            $item.append($contentContainer).append($operateContainer);
            this.$container.append($item);
            // $items.append($item);
        }

        this._bindEvent();
    },
    _bindEvent: function() {
        var self = this;
        $('input[type="text"]', this.$container).on('keyup', function() {
            var $this = $(this),
                flag = $this.attr('data-flag').split('_');
            if (flag.length === 2) {
                self._getCashbackCouponItemObj(flag[0])[flag[1]] = $this.val();
            } else if (flag.length === 3) {
                self._getCashbackItem(flag[0])[flag[2]] = $this.val();
            } else if (flag.length === 4) {
                self._getCouponItem(flag[0])[flag[2]][flag[3]] = $this.val();
            }
            console.log(self._getCashbackCouponObj());
        });
        $('.J_type', this.$container).on('change', function() {
            var $this = $(this),
                flag = $this.attr('data-flag').split('_');
            var checkeds = [];
            $('.J_type:checked', self.$container).each(function() {
                checkeds.push($(this).val());
            });
            self._getCashbackCouponItemObj(flag[0])[flag[1]] = checkeds.join(',');
            console.log(self._getCashbackCouponObj());
        });
    },
    _createCashbackCouponItem: function(index) {
        var cashbackCoupon = this._getCashbackCouponItemObj(index),
            cashback = this._getCashbackItem(index);
        var itemDom = `<div class="am-panel am-panel-default">
                <div class="am-panel-bd">
                    <div>
                        开始:<input type="text" data-flag="${index}_begin" value="${cashbackCoupon.begin}"/>
                        结束:<input type="text" data-flag="${index}_end" value="${cashbackCoupon.end}"/>
                    </div>
                    <div>
                        <p><input type="checkbox" class="J_type" data-flag="${index}_type" value="${this.options.cashbackType}"/>现金：</p>
                        <div>
                            <input type="text" data-flag="${index}_${this.options.cashbackType}_credit" value="${cashback.credit}"/>
                            <select>
                                <option value="1" checked>金额（元）</option>
                                <option value="2">百分率（%）</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <p><input type="checkbox" class="J_type" data-flag="${index}_type" value="${this.options.couponType}"/>优惠劵：</p>
                        <table>
                        <thead>
                            <tr>
                                <th>名称</th>
                                <th>额度</th>
                                <th>限额</th>
                                <th>期限</th>
                                <th>数量</th>
                                <th>加气站</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="co-tbody-${index}">
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
        var $itemDom = $(itemDom);
        this._createCoupon(index, $('tbody', $itemDom));
        return $itemDom;
    },
    _createCoupon: function(index, $container) {
        $container.html('');
        var coupons = this._getCouponItem(index),
            i = 0,
            length = coupons.length,
            coupon,
            tds,
            $tr;
        for (; i < length; i++) {
            $tr = $('<tr></tr>');
            coupon = coupons[i];
            tds = $(`<td><input type="text" data-flag="${index}_${this.options.couponType}_${i}_name" value="${coupon.name}"/></td>
            <td><input type="text" data-flag="${index}_${this.options.couponType}_${i}_denomination" value="${coupon.denomination}"/></td>
            <td><input type="text" data-flag="${index}_${this.options.couponType}_${i}_limit" value="${coupon.limit}"/></td>
            <td><input type="text" data-flag="${index}_${this.options.couponType}_${i}_expires" value="${coupon.expires}"/></td>
            <td><input type="text" data-flag="${index}_${this.options.couponType}_${i}_amount" value="${coupon.amount}"/></td>
            <td><input type="text" data-flag="${index}_${this.options.couponType}_${i}_gastations" value="${coupon.gastations}"/></td>
            `);
            $tr.append(tds);
            // $tr.append($('<td><input type="text" class="J_coupon_Name co_' + index + '_' + i + '_name" value="' + coupon.name + '"/></td>'));
            // $tr.append($('<td><input type="text" class="J_coupon_Denomination co_' + index + '_' + i + '_denomination" value="' + coupon.denomination + '"/></td>'));
            // $tr.append($('<td><input type="text" class="J_coupon_Limit co_' + index + '_' + i + '_limit" value="' + coupon.limit + '"/></td>'));
            // $tr.append($('<td><input type="text" class="J_coupon_Expires co_' + index + '_' + i + '_expires" value="' + coupon.expires + '"/></td>'));
            // $tr.append($('<td><input type="text" class="J_coupon_Amount co_' + index + '_' + i + '_amount" value="' + coupon.amount + '"/></td>'));
            // $tr.append($('<td><input type="text" class="J_coupon_Gastations co_' + index + '_' + i + '_gastations" value="' + coupon.gastations + '"/></td>'));
            if (i === length - 1) {
                $tr.append($('<td><a href="javascript:void(0)" class="co-coupon-plus iconfont">+</a></td>'));
            } else {
                $tr.append($('<td><a href="javascript:void(0)" class="co-coupon-reduce iconfont">-</a></td>'));
            }
            (function(index, i, $tr, self) {
                $('.co-coupon-plus', $tr).on('click', function() {
                    self._addCouponItem(index);
                });
                $('.co-coupon-reduce', $tr).on('click', function() {
                    self._removeCouponItem(index, i);
                });
            })(index, i, $tr, this);
            $container.append($tr);
        }
    },
    _getCashbackCouponObj: function() {
        return this.options.setObj || (this.options.setObj = [{
            begin: '',
            end: '',
            type: ''
        }]);
    },
    _getCashbackCouponItemObj: function(index) {
        var cashbackCouponObj = this._getCashbackCouponObj();
        return cashbackCouponObj[index];
    },
    _getCashbackItem: function(index) {
        var itemObj = this._getCashbackCouponItemObj(index);
        return itemObj.cashback || (itemObj.cashback = {
            type: '',
            credit: ''
        });
    },
    _getCouponItem: function(index) {
        var itemObj = this._getCashbackCouponItemObj(index);
        return itemObj.coupons || (itemObj.coupons = [{
            name: '',
            denomination: '',
            limit: '',
            expires: '',
            amount: '',
            gastations: ''
        }]);
    },
    _addCashbackCouponItem: function() {
        this.options.setObj.push({
            begin: '',
            end: '',
            type: ''
        });
        this._createCashbackCoupon();
    },
    _removeCashbackCouponItem: function(index) {
        this.options.setObj.splice(index, 1);
        this._createCashbackCoupon();
    },
    _addCouponItem: function(index) {
        var coupons = this._getCouponItem(index);
        coupons.push({
            name: '',
            denomination: '',
            limit: '',
            expires: '',
            amount: '',
            gastations: ''
        });
        this._createCoupon(index, $('.co-tbody-' + index));
    },
    _removeCouponItem: function(index, i) {
        var coupons = this._getCouponItem(index);
        coupons.splice(i, 1);
        this._createCoupon(index, $('.co-tbody-' + index));
    }
};
new CashbackCouponSet($('.J_container'))
