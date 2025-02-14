import { CreateSnapshotsUseCase } from '@/application/usecases/CreateSnapshotsUseCase';
import { FileCompressionService } from '@/domain/file-handling/FileCompressionService';
import { IFileSystemService } from '@/domain/file-handling/IFileSystemService';
import { ImageProcessingService } from '@/domain/file-handling/ImageProcessingService';
import { IMessageQueue } from '@/domain/queues/IMessageQueue';
import { IFileRepositorie } from '@/domain/repositories/IFileRepositorie';

describe('ImportFileUseCase Constructor', () => {
  let imageProcessingService: ImageProcessingService;
  let compressionService: FileCompressionService;
  let rabbitMQPublisher: IMessageQueue;
  let fileSystemService: IFileSystemService;
  let fileRepositorie: IFileRepositorie;

  beforeEach(() => {
    imageProcessingService = {} as ImageProcessingService;
    compressionService = {} as FileCompressionService;
    rabbitMQPublisher = {} as IMessageQueue;
    fileSystemService = {
      outputFolder: jest.fn().mockReturnValue('mockOutputFolder'),
      destinationZipFilePath: jest.fn().mockReturnValue('mockDestinationZipFilePath')
    } as unknown as IFileSystemService;
    fileRepositorie = {} as IFileRepositorie;
  });

  it('should initialize outputFolder and destinationZipFilePath correctly', () => {
    const useCase = new CreateSnapshotsUseCase(
      imageProcessingService,
      compressionService,
      rabbitMQPublisher,
      fileSystemService,
      fileRepositorie
    );

    expect(useCase['outputFolder']).toBe('mockOutputFolder');
    expect(useCase['destinationZipFilePath']).toBe('mockDestinationZipFilePath');
    expect(fileSystemService.outputFolder).toHaveBeenCalled();
    expect(fileSystemService.destinationZipFilePath).toHaveBeenCalled();
  });
});