import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { ToastrService } from 'ngx-toastr';

describe('ToastService', () => {
  let service: ToastService;

  const toastrMock = {
    success: jasmine.createSpy('success'),
    info: jasmine.createSpy('info'),
    error: jasmine.createSpy('error'),
    warning: jasmine.createSpy('warning')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: ToastrService, useValue: toastrMock }
      ]
    });

    service = TestBed.inject(ToastService);
  });

  beforeEach(() => {
    toastrMock.success.calls.reset();
    toastrMock.info.calls.reset();
    toastrMock.error.calls.reset();
    toastrMock.warning.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call success toastr', () => {
    service.successToastr('title', 'message');

    expect(toastrMock.success).toHaveBeenCalledWith('message', 'title');
  });

  it('should call info toastr', () => {
    service.infoToastr('title', 'message');

    expect(toastrMock.info).toHaveBeenCalledWith('message', 'title');
  });

  it('should call error toastr', () => {
    service.errorToastr('title', 'message');

    expect(toastrMock.error).toHaveBeenCalledWith('message', 'title');
  });

  it('should call warning toastr', () => {
    service.warningToastr('title', 'message');

    expect(toastrMock.warning).toHaveBeenCalledWith('message', 'title');
  });
});