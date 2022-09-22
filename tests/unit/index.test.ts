
import * as service from '../../src/services/voucherService';
import * as errorUtils from '../../src/utils/errorUtils';
import voucherRepository from '../../src/repositories/voucherRepository'
import {jest} from '@jest/globals'
import { conflictError } from '../../src/utils/errorUtils'


describe("Testar o VoucherService", () => {

    it("deve criar um voucher", async () => {

      const voucher = {id: 1, code: 'T6', discount: 20, used: false};

      jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(null);
      jest.spyOn(voucherRepository, 'createVoucher').mockResolvedValueOnce(voucher);
  
      await service.createVoucher(voucher.code, voucher.discount);
      expect(voucherRepository.createVoucher).toBeCalledTimes(1);
    })
      
    it("não deve criar um voucher, pois ja existe", async () => {
      const voucher = {id: 1, code: 'T6', discount: 20, used: false};
      jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(voucher);
  
      expect(service.createVoucher(voucher.code, voucher.discount)).rejects.toEqual(errorUtils.conflictError("Voucher already exist."))
    });
  
    it("deve aplicar voucher", async () => {
      const voucher = {id: 1, code: 'T6', discount: 20, used: false};
      jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(voucher);
      jest.spyOn(voucherRepository, 'useVoucher').mockResolvedValueOnce({...voucher, used: true});
  
      const test = await service.applyVoucher(voucher.code, 200);
      expect(test).toEqual({amount: 200, discount: 20, finalAmount: 160, applied: true})
    })
  
    it("não deve aplicar voucher", async () => {
      const voucher = {id: 1, code: 'T6', discount: 20, used: false};
      jest.spyOn(voucherRepository, 'getVoucherByCode').mockResolvedValueOnce(null);
  
      expect(service.applyVoucher(voucher.code, voucher.discount)).rejects.toEqual(errorUtils.conflictError("Voucher does not exist."));
    })
  })